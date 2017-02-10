module ProjectHelper
  def check_panding_project_user_status(project, user_id)
    user_project = project.project_users.find_by(user_id: user_id, project_id: project.id)
    user_project.unapproved? if user_project.present?
  end
end
