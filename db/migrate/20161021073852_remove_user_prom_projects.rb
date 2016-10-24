class RemoveUserPromProjects < ActiveRecord::Migration[5.0]
  def up
    Project.all.each do |project|
      ProjectUser.create(project_id: project.id, user_id: project.user_id) if project.user_id.present?
    end
    remove_reference :projects, :user, index: true
  end

  def down
    add_reference :projects, :user, index: true
  end
end
