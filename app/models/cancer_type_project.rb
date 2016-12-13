# == Schema Information
#
# Table name: cancer_types_projects
#
#  project_id     :integer
#  cancer_type_id :integer
#

class CancerTypeProject < ApplicationRecord
  self.table_name = :cancer_types_projects

  after_create :notify_users_for_update

  belongs_to :cancer_type
  belongs_to :project

  private

    def notify_users_for_update
      users = ActivityFeed.where(actionable_type: 'CancerType', actionable_id: cancer_type.id, action: 'following').pluck(:user_id)
      Notification.build(users, project, "was added to cancer type #{cancer_type.name}") if users.any?
    end
end
