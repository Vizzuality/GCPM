# == Schema Information
#
# Table name: cancer_types_projects
#
#  project_id     :integer
#  cancer_type_id :integer
#

class CancerTypeProject < ApplicationRecord
  self.table_name = :cancer_types_projects

  after_create :notify_users_for_update, if: "project.status == 'published'"

  belongs_to :cancer_type
  belongs_to :project

  def self.each_touch(project_id)
    CancerTypeProject.where(project_id: project_id).map {
      |cancer_types_project| cancer_types_project.notify_users_for_update
    }
  end

  def notify_users_for_update
    users = ActivityFeed.where(actionable_type: 'CancerType', actionable_id: cancer_type.id, action: 'following').pluck(:user_id)
    Notification.build(users, project, "was added to cancer type #{cancer_type.name}") if users.any?
  end
end
