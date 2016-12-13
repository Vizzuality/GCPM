# == Schema Information
#
# Table name: projects
#
#  id              :integer          not null, primary key
#  title           :string
#  summary         :text
#  project_website :text
#  start_date      :date
#  end_date        :date
#  status          :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  slug            :string
#  created_by      :integer
#

class Project < ApplicationRecord
  enum status: [:under_revision, :published, :unpublished]

  acts_as_followable

  include UserRelationable
  include ActAsFeatured

  after_create :notify_admin

  has_many :memberships
  has_many :research_units,  through: :memberships
  has_many :organizations,   through: :memberships
  has_many :investigators,   through: :research_units, source: :investigator
  has_many :addresses,       through: :research_units, source: :address
  has_many :countries,       through: :addresses
  has_many :funders
  has_many :funding_sources, through: :funders,        source: :organization

  has_many :project_leads,           -> { where(memberships: { membership_type: 0 }) }, through: :research_units, source: :investigator
  has_many :secondary_investigators, -> { where(memberships: { membership_type: 1 }) }, through: :research_units, source: :investigator

  has_many :project_users, dependent: :destroy
  has_many :users, through: :project_users

  has_many :project_updates
  has_many :pins, as: :pinable
  has_many :posts, through: :pins

  has_and_belongs_to_many :project_types
  has_and_belongs_to_many :cancer_types
  has_and_belongs_to_many :specialities

  accepts_nested_attributes_for :memberships,   allow_destroy: true
  accepts_nested_attributes_for :investigators, update_only:   true
  accepts_nested_attributes_for :organizations, update_only:   true
  accepts_nested_attributes_for :addresses,     update_only:   true
  accepts_nested_attributes_for :funding_sources
  accepts_nested_attributes_for :users

  validates_presence_of   :title, :summary
  validates_uniqueness_of :title
  validate                :dates_timeline
  validates               :start_date, date: true, allow_blank: true
  validates               :end_date,   date: true, allow_blank: true
  validates_acceptance_of :terms

  include Sluggable

  scope :publihsed,             ->                     { where(status: :published) }
  scope :active,                ->                     { where('projects.end_date >= ? AND projects.start_date <= ?', Time.now, Time.now).or(where('projects.end_date IS NULL')) }
  scope :inactive,              ->                     { where('projects.end_date < ?', Time.now).or('projects.start_date > ?', Time.now) }
  scope :by_project_types,      -> project_types       { joins(:project_types).where(project_types: { id: project_types }) }
  scope :by_cancer_types,       -> cancer_types        { joins(:cancer_types).where(cancer_types: { id: cancer_types }) }
  scope :by_specialities,       -> specialities        { joins(:specialities).where(specialities: { id: specialities }) }
  scope :by_investigators,      -> investigators       { joins(:investigators).where(investigators: { id: investigators }) }
  scope :by_organizations,      -> organizations       { joins(:organizations).where(organizations: { id: organizations }) }
  scope :by_organization_types, -> organization_types  { joins(organizations: :organization_type).where(organization_types: { id: organization_types }) }
  scope :by_countries,          -> countries           { joins(:countries).where(countries: { country_iso_3: countries }) }
  scope :by_regions,            -> regions             { joins(:countries).where(countries: { region_iso: regions }) }
  scope :by_start_date,         -> start_date          { where('projects.start_date > ?', start_date ) }
  scope :by_end_date,           -> end_date            { where('projects.end_date < ?', end_date ) }
  scope :by_user,               -> user                { joins(:project_users).where('project_users.user_id = ? AND project_users.is_approved = ?', user, true ) }

  class << self
    def fetch_all(options={})
      projects = self.published
      projects = projects.by_countries(options[:countries])                   if options[:countries]
      projects = projects.by_regions(options[:regions])                       if options[:regions]
      projects = projects.by_investigators(options[:investigators])           if options[:investigators]
      projects = projects.by_project_types(options[:project_types])           if options[:project_types]
      projects = projects.by_cancer_types(options[:cancer_types])             if options[:cancer_types]
      projects = projects.by_specialities(options[:specialities])             if options[:specialities]
      projects = projects.by_organizations(options[:organizations])           if options[:organizations]
      projects = projects.by_organization_types(options[:organization_types]) if options[:organization_types]
      projects = projects.by_start_date(options[:start_date])                 if options[:start_date]
      projects = projects.by_end_date(options[:end_date])                     if options[:end_date]
      projects = projects.by_user(options[:user])                             if options[:user]
      projects = projects.order('projects.created_at ASC')                    if options[:sortby] && options[:sortby] == 'created_asc'
      projects = projects.order('projects.created_at DESC')                   if options[:sortby] && options[:sortby] == 'created_desc'
      projects = projects.order('projects.title ASC')                         if options[:sortby] && options[:sortby] == 'title_asc'
      projects = projects.order('projects.title DESC')                        if options[:sortby] && options[:sortby] == 'title_desc'
      projects = projects.limit(options[:limit])                              if options[:limit]
      projects = projects.offset(options[:offset])                            if options[:offset]
      projects.distinct
    end

    def build_project(options)
      options = build_project_attributes(options) if options['new_funders'].present? || options['memberships'].present?
      Project.new(options)
    end

    def update_project(options, project)
      options = build_project_attributes(options, project) if options['new_funders'].present? || options['memberships'].present?
      project.update(options)
    end

    def build_project_attributes(options, project=nil)
      funders            = options['new_funders']
      memberships        = options['memberships']
      options            = options.except(:new_funders, :memberships)
      project.attributes = options if project.present?
      validate_project   = project.present? ? project.valid? : Project.new(options).valid?
      project_id         = project.id if project.present?

      if validate_project
        build_funding_sources(funders, options) if funders.present?
        build_memberships(memberships, options, project_id) if memberships.present?
      end
      options
    end

    def build_funding_sources(funders, options)
      funding_sources = []
      funders.each do |funder_params|
        funding_sources << Organization.create(funder_params)
      end
      options['funding_source_ids']  = [] if options['funding_source_ids'].blank?
      options['funding_source_ids'] += funding_sources.map(&:id)
      options
    end

    def build_memberships(memberships, options, project_id=nil)
      memberships_attributes = []
      memberships.each do |membership_params|
        if membership_params[:research_unit_attributes].present?
          investigator_params = membership_params[:research_unit_attributes][:investigator_id] if membership_params[:research_unit_attributes][:investigator_id].present?
          address_params      = membership_params[:research_unit_attributes][:address_id]      if membership_params[:research_unit_attributes][:address_id].present?
          if investigator_params.present? && address_params.present?
            memberships_attributes << check_existing_research_units_and_build_params(membership_params, investigator_params, address_params, project_id)
          else
            memberships_attributes << membership_params
          end
        else
          memberships_attributes << membership_params
        end
      end
      options['memberships_attributes'] = memberships_attributes
      options
    end

    def check_existing_research_units_and_build_params(membership_params, investigator_params, address_params, project_id)
      existing_ru = ResearchUnit.find_by(investigator_id: investigator_params, address_id: address_params)
      if existing_ru.present?
        ru_id = existing_ru.id
        if project_id.present?
          membership = Membership.find_by(project_id: project_id, research_unit_id: ru_id)
          if membership.present?
            membership_params = { id: membership.id, membership_type: membership_params[:membership_type] }
          else
            membership_params = { research_unit_id: ru_id, membership_type: membership_params[:membership_type] }
          end
        else
          membership_params = { research_unit_id: ru_id, membership_type: membership_params[:membership_type] }
        end
      else
        membership_params
      end
    end
  end

  def related(options={})
    related_projects = RelatedProject.new(self, options)
    related_projects.related
  end

  def project_lead
    investigators.where(memberships: { membership_type: 0 }).first
  end

  def main_organization
    organizations.where(memberships: { membership_type: 0 }).first
  end

  def active
    self.end_date > Time.now && self.start_date < Time.now if self.start_date && self.end_date
  end

  def inactive
    self.end_date < Time.now && self.start_date < Time.now if self.start_date && self.end_date
  end

  def publish
    self.status = :published
    save
  end

  def unpublish
    self.status = :unpublished
    save
  end

  def project_creator(user_id)
    self.created_by == user_id
  end

  def select_investigators(ru_id=nil)
    if ru_id.present?
      ResearchUnit.includes(:investigator).find(ru_id).investigator.name
    else
      ResearchUnit.includes(:investigator).all.map { |ru| [ru.investigator.name, ru.id] }
    end
  end

  def select_organizations(ru_id=nil)
    if ru_id.present?
      ResearchUnit.includes(:organization).find(ru_id).organization.name
    else
      ResearchUnit.includes(:investigator, investigator: :organizations).all
                  .map { |ru| ru.investigator.organizations.map { |o| [o.name, ru.id] }.flatten! }
    end
  end

  def select_addresses(ru_id=nil)
    if ru_id.present?
      ResearchUnit.includes(:address).find(ru_id).address.country_name
    else
      ResearchUnit.includes(:address).all.map { |ru| [ru.address.country_name, ru.id] }
    end
  end

  private

    def dates_timeline
      if self.start_date.present? && self.end_date.present?
        errors.add(:end_date, 'must be after start date') if self.start_date > self.end_date
      end
    end

    def notify_admin
      AdminMailer.user_relation_email('project', self.title, 'created').deliver_later
    end
end
