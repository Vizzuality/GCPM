module ProjectHelper
  def check_panding_project_user_status(project, user_id)
    project.project_users.find_by(user_id: user_id, project_id: project.id).unapproved?
  end
end
