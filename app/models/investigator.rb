# == Schema Information
#
# Table name: investigators
#
#  id         :integer          not null, primary key
#  name       :string
#  email      :string
#  website    :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Investigator < ApplicationRecord
  has_many :research_units
  has_many :addresses,     through: :research_units
  has_many :organizations, through: :addresses
  has_many :memberships,   through: :research_units
  has_many :projects,      through: :memberships

  accepts_nested_attributes_for :organizations, allow_destroy: true
  accepts_nested_attributes_for :addresses,     allow_destroy: true

  validates_presence_of :name

  scope :publihsed,             ->                     { joins(:projects).where(status: :published) }
  scope :active,                ->                     { joins(:projects).where('projects.end_date >= ? AND projects.start_date <= ?', Time.now, Time.now).or(where('projects.end_date IS NULL')) }
  scope :inactive,              ->                     { joins(:projects).where('projects.end_date < ?', Time.now).or('projects.start_date > ?', Time.now) }
  scope :by_project_types,      -> project_types       { joins(projects: :project_types).where(project_types: { id: project_types }) }
  scope :by_cancer_types,       -> cancer_types        { joins(projects: :cancer_types).where(cancer_types: { id: cancer_types }) }
  scope :by_investigators,      -> investigators       { joins(:investigators).where(investigators: { id: investigators }) }
  scope :by_organizations,      -> organizations       { joins(:organizations).where(organizations: { id: organizations }) }
  scope :by_organization_types, -> organization_types  { joins(organizations: :organization_type).where(organization_types: { id: organization_types }) }
  scope :by_countries,          -> countries           { joins(:countries).where(countries: { id: countries }) }
  scope :by_regions,            -> regions             { joins(:countries).where(countries: { region_iso: regions }) }
  scope :by_start_date,         -> start_date          { joins(:projects).where('projects.start_date > ?', start_date ) }
  scope :by_end_date,           -> end_date            { joins(:projects).where('projects.end_date < ?', end_date ) }
  scope :by_user,               -> user                { joins(:projects).where('projects.user_id = ?', user ) }

  def self.fetch_all(options={})
    investigators = Investigator.all
    investigators = investigators.by_investigators(options[:investigators])           if options[:investigators]
    investigators = investigators.by_project_types(options[:project_types])           if options[:project_types]
    investigators = investigators.by_cancer_types(options[:cancer_types])             if options[:cancer_types]
    investigators = investigators.by_countries(options[:countries])                   if options[:countries]
    investigators = investigators.by_regions(options[:regions])                       if options[:regions]
    investigators = investigators.by_organizations(options[:organizations])           if options[:organizations]
    investigators = investigators.by_organization_types(options[:organization_types]) if options[:organization_types]
    investigators = investigators.by_start_date(options[:start_date])                 if options[:start_date]
    investigators = investigators.by_end_date(options[:end_date])                     if options[:end_date]
    investigators = investigators.by_user(options[:user])                             if options[:user]
    investigators = investigators.order('investigators.created_at ASC')                    if options[:sortby] && options[:sortby] == 'created_asc'
    investigators = investigators.order('investigators.created_at DESC')                   if options[:sortby] && options[:sortby] == 'created_desc'
    investigators = investigators.order('investigators.title ASC')                         if options[:sortby] && options[:sortby] == 'title_asc'
    investigators = investigators.order('investigators.title DESC')                        if options[:sortby] && options[:sortby] == 'title_desc'
    investigators = investigators.limit(options[:limit])                              if options[:limit]
    investigators = investigators.offset(options[:offset])                            if options[:offset]
    investigators.uniq
  end
end
