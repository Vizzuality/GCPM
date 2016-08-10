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
#  user_id         :integer
#

class Project < ApplicationRecord
  enum status: [:under_revision, :published, :unpublished]

  belongs_to :user, inverse_of: :projects, optional: true

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

  has_and_belongs_to_many :project_types
  has_and_belongs_to_many :cancer_types

  accepts_nested_attributes_for :memberships,   allow_destroy: true
  accepts_nested_attributes_for :investigators, update_only:   true
  accepts_nested_attributes_for :organizations, update_only:   true
  accepts_nested_attributes_for :addresses,     update_only:   true

  validates_presence_of :title, :summary
  validates :title, uniqueness: true
  validates_acceptance_of :terms

  scope :publihsed,             ->                     { where(status: :published) }
  scope :active,                ->                     { where('projects.end_date >= ? AND projects.start_date <= ?', Time.now, Time.now).or(where('projects.end_date IS NULL')) }
  scope :inactive,              ->                     { where('projects.end_date < ?', Time.now).or('projects.start_date > ?', Time.now) }
  scope :by_project_types,      -> project_types       { joins(:project_types).where(project_types: { id: project_types }) }
  scope :by_cancer_types,       -> cancer_types        { joins(:cancer_types).where(cancer_types: { id: cancer_types }) }
  scope :by_organizations,      -> organizations       { joins(:organizations).where(organizations: { id: organizations }) }
  scope :by_organization_types, -> organization_types  { joins(organizations: :organization_type).where(organization_types: { id: organization_types }) }
  scope :by_countries,          -> countries           { joins(:countries).where(countries: { id: countries }) }
  scope :by_regions,            -> regions             { joins(:countries).where(countries: { region_iso: regions }) }
  scope :by_start_date,         -> start_date          { where('projects.start_date > ?', start_date ) }
  scope :by_end_date,           -> end_date            { where('projects.end_date < ?', end_date ) }
  scope :by_user,               -> user                { where('projects.user_id = ?', user ) }

  def self.fetch_all(options)
    projects = Project.published
    projects = projects.by_project_types(options[:project_types])           if options[:project_types]
    projects = projects.by_cancer_types(options[:cancer_types])             if options[:cancer_types]
    projects = projects.by_countries(options[:countries])                   if options[:countries]
    projects = projects.by_regions(options[:regions])                       if options[:regions]
    projects = projects.by_organizations(options[:organizations])           if options[:organizations]
    projects = projects.by_organization_types(options[:organization_types]) if options[:organization_types]
    projects = projects.by_start_date(options[:start_date])                 if options[:start_date]
    projects = projects.by_end_date(options[:end_date])                     if options[:end_date]
    projects = projects.by_user(options[:user])                             if options[:user]
    projects = projects.limit(options[:limit])                              if options[:limit]
    projects = projects.offset(options[:offset])                            if options[:offset]
    projects.uniq
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
end
