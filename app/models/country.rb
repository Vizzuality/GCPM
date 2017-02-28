# == Schema Information
#
# Table name: countries
#
#  id               :integer          not null, primary key
#  country_name     :string
#  region_name      :string
#  country_iso      :string
#  region_iso       :string
#  country_centroid :string
#  region_centroid  :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  country_iso_3    :string
#

class Country < ApplicationRecord
  acts_as_followable

  after_update :notify_users_for_update

  has_many :addresses
  has_many :research_units, through: :addresses
  has_many :memberships,    through: :research_units
  has_many :projects,       through: :memberships
  has_many :organizations,  through: :addresses
  has_many :pins,           as: :pinable
  has_many :posts,          through: :pins

  def projects_count
    self.projects.uniq.size
  end
  def organizations_count
    self.organizations.uniq.size
  end
  def events_count
    Event.where(country: c.country_name).uniq.size
  end

  def self.names
    Country.all.order(:country_name).pluck(:country_name)
  end

  private

    def notify_users_for_update
      users = ActivityFeed.where(actionable_type: 'Country', actionable_id: self.id, action: 'following').pluck(:user_id)
      Notification.build(users, self, 'was updated') if users.any?
    end
end
