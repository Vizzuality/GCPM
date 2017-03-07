# == Schema Information
#
# Table name: investigators
#
#  id          :integer          not null, primary key
#  name        :string
#  email       :string
#  website     :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :integer
#  is_approved :boolean          default(FALSE)
#  slug        :string
#

class Investigator < ApplicationRecord
  acts_as_followable

  include Approvable
  include UserRelationable
  include ActAsFeatured

  after_create :notify_admin,            if: 'user_id.present?'
  after_update :notify_users_for_update, if: 'approved?'

  belongs_to :user, inverse_of: :investigator, optional: true

  has_many :research_units

  has_many :addresses,     through: :research_units
  has_many :organizations, through: :addresses
  has_many :memberships,   through: :research_units
  has_many :projects,      through: :memberships

  accepts_nested_attributes_for :organizations
  accepts_nested_attributes_for :addresses
  accepts_nested_attributes_for :research_units, allow_destroy: true

  attr_accessor :assign_to_user

  validates_presence_of   :name
  validates_uniqueness_of :user_id, allow_blank: true
  validates               :email, format: { with: Devise.email_regexp }, allow_blank: true, on: :create

  include Sluggable

  scope :publihsed,             ->                    { joins(:projects).where('projects.status = ?', 1) }
  scope :active,                ->                    { joins(:projects).where('projects.end_date >= ? AND projects.start_date <= ?', Time.now, Time.now).or(where('projects.end_date IS NULL')) }
  scope :inactive,              ->                    { joins(:projects).where('projects.end_date < ?', Time.now).or('projects.start_date > ?', Time.now) }
  scope :by_project_types,      -> project_types      { joins(projects: :project_types).where(project_types: { id: project_types }).publihsed }
  scope :by_cancer_types,       -> cancer_types       { joins(projects: :cancer_types).where(cancer_types: { id: cancer_types }).publihsed }
  scope :by_specialities,       -> specialities       { joins(projects: :specialities).where(specialities: { id: specialities }).publihsed }
  scope :by_investigators,      -> investigators      { joins(:investigators).where(investigators: { id: investigators }) }
  scope :by_organizations,      -> organizations      { joins(:organizations).where(organizations: { id: organizations }) }
  scope :by_funding_sources,    -> funding_sources    { joins(projects: :funders).where(funders: { organization_id: funding_sources }) }
  scope :by_organization_types, -> organization_types { joins(organizations: :organization_type).where(organization_types: { id: organization_types }) }
  scope :by_countries,          -> countries          { joins([research_units: [address: :country]]).where(countries: { country_iso_3: countries }) }
  scope :by_regions,            -> regions            { joins(research_units: [address: :country]).where(countries: { region_iso: regions }) }
  scope :by_start_date,         -> start_date         { joins(:projects).where('projects.start_date > ?', start_date ) }
  scope :by_end_date,           -> end_date           { joins(:projects).where('projects.end_date < ?', end_date ) }
  scope :by_user,               -> user               { where('investigators.user_id = ? AND investigators.is_approved = ?', user, true ) }
  scope :user_present,          ->                    { where.not(investigators: { user_id: nil } ) }
  scope :for_render,            ->                    { includes(:organizations, [organizations: :addresses]) }
  scope :filter_name,           -> investigator_name  { where('investigators.name ILIKE ?', "%#{investigator_name}%") }
  scope :order_by_name,         ->                    { order('investigators.name ASC') }

  def graph
    self.projects.includes(:investigators)
  end

  class << self
    def fetch_all(options={})
      investigators = Investigator.all.for_render.order_by_name
      investigators = investigators.by_countries(options[:countries])                   if options[:countries]
      investigators = investigators.by_regions(options[:regions])                       if options[:regions]
      investigators = investigators.by_investigators(options[:investigators])           if options[:investigators]
      investigators = investigators.by_project_types(options[:project_types])           if options[:project_types]
      investigators = investigators.by_cancer_types(options[:cancer_types])             if options[:cancer_types]
      investigators = investigators.by_specialities(options[:specialities])             if options[:specialities]
      investigators = investigators.by_countries(options[:countries])                   if options[:countries]
      investigators = investigators.by_regions(options[:regions])                       if options[:regions]
      investigators = investigators.by_organizations(options[:organizations])           if options[:organizations]
      investigators = investigators.by_organizations(options[:funding_sources])         if options[:funding_sources]
      investigators = investigators.by_organization_types(options[:organization_types]) if options[:organization_types]
      investigators = investigators.by_start_date(options[:start_date])                 if options[:start_date]
      investigators = investigators.by_end_date(options[:end_date])                     if options[:end_date]
      investigators = investigators.by_user(options[:user])                             if options[:user]
      investigators = investigators.order('investigators.created_at ASC')               if options[:sortby] && options[:sortby] == 'created_asc'
      investigators = investigators.order('investigators.created_at DESC')              if options[:sortby] && options[:sortby] == 'created_desc'
      investigators = investigators.order('investigators.name ASC')                     if options[:sortby] && options[:sortby] == 'title_asc'
      investigators = investigators.order('investigators.name DESC')                    if options[:sortby] && options[:sortby] == 'title_desc'
      investigators = investigators.limit(options[:limit])                              if options[:limit]
      investigators = investigators.offset(options[:offset])                            if options[:offset]
      investigators = investigators.filter_name(options[:q])                            if options[:q].present?
      investigators.distinct
    end
  end

  private

    def notify_admin
      AdminMailer.user_relation_email('investigator', self.name, 'created').deliver_later
    end

    def notify_users_for_update
      users = ActivityFeed.where(actionable_type: 'Investigator', actionable_id: self.id, action: 'following').pluck(:user_id)
      Notification.build(users, self, 'was updated') if users.any?
    end
end
