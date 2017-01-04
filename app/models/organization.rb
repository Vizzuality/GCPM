# == Schema Information
#
# Table name: organizations
#
#  id                   :integer          not null, primary key
#  name                 :string
#  acronym              :string
#  grid_id              :string
#  email_address        :string
#  established          :integer
#  organization_type_id :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  slug                 :string
#

class Organization < ApplicationRecord
  include ActAsFeatured

  after_update :notify_users_for_update

  belongs_to :organization_type

  has_many :addresses
  has_many :research_units, through: :addresses
  has_many :investigators,  through: :research_units, foreign_key: 'investigator_id'
  has_many :memberships,    through: :research_units
  has_many :projects,       through: :memberships
  has_many :pins,           as: :pinable
  has_many :posts,          through: :pins

  has_many :funders
  has_many :funded_projects, through: :funders, source: :project

  accepts_nested_attributes_for :addresses, allow_destroy: true

  validates_presence_of   :name
  validates               :email_address, format: { with: Devise.email_regexp }, allow_blank: true, on: :create

  scope :filter_name, -> organization_name { where('name ILIKE ?', "%#{organization_name}%") }

  include Sluggable

  class << self
    def are_funding_sources
      Organization.joins(:funders)
    end

    def fetch_all(options)
      organizations = Organization.all
      organizations = organizations.are_funding_sources      if options[:funding_source]
      organizations = organizations.joins(:projects)         if options[:active] && options[:active] = true
      organizations = organizations.filter_name(options[:q]) if options[:q].present?
      organizations.distinct
    end
  end

  private

    def notify_users_for_update
      users = ActivityFeed.where(actionable_type: 'Organization', actionable_id: self.id, action: 'following').pluck(:user_id)
      Notification.build(users, self, 'was updated') if users.any?
    end
end
