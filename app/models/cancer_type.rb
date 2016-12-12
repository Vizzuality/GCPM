# == Schema Information
#
# Table name: cancer_types
#
#  id          :integer          not null, primary key
#  name        :string
#  description :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  slug        :string
#

class CancerType < ApplicationRecord
  acts_as_followable

  after_update :notify_users_for_update, if: 'name_changed? || description_changed?'

  has_many :pins,  as: :pinable
  has_many :posts, through: :pins

  has_many :cancer_type_projects
  has_many :projects, through: :cancer_type_projects

  validates_presence_of   :name
  validates_uniqueness_of :name

  include Sluggable

  def projects_count
    self.projects.uniq.size
  end

  def organizations_count
    self.projects.joins(:organizations).count('distinct(organizations.id)')
  end

  def countries_count
    self.projects.joins(:countries).count('distinct(countries.id)')
  end

  private

    def notify_users_for_update
      users = ActivityFeed.where(actionable_type: 'CancerType', actionable_id: self.id, action: 'following').pluck(:user_id)
      Notification.build(users, self, 'updated')
    end
end
