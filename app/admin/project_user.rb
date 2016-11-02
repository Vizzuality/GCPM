ActiveAdmin.register ProjectUser do
  actions :all, except: [:update, :edit, :show]

  menu label: "User's projects", parent: 'Network', priority: 1

  permit_params :project_id, :user_id, :is_approved

  controller do
    before_action { @page_title = "User's projects" }

    def destroy
      @project_user = ProjectUser.find(params[:id])
      if @project_user.destroy
        UserMailer.user_relation_email(@project_user.user.name, @project_user.user.email, @project_user.project.title, 'removed').deliver_later
        redirect_to admin_project_users_path, notice: 'The relation have been removed.'
      end
    end
  end

  member_action :approve, method: :patch do
    resource.update(is_approved: true)
    UserMailer.user_relation_email(resource.user.name, resource.user.email, resource.project.title, 'approved').deliver_later
    redirect_to admin_project_users_path, notice: 'The relation have been approved.'
  end

  member_action :unapprove, method: :patch do
    resource.update(is_approved: false)
    UserMailer.user_relation_email(resource.user.name, resource.user.email, resource.project.title, 'unapproved').deliver_later
    redirect_to admin_project_users_path, notice: 'The relation have been unapproved.'
  end

  batch_action :unapprove do |ids|
    ProjectUser.find(ids).each do |project_user|
      project_user.update(is_approved: false)
    end
    redirect_to collection_path, alert: "The relation have been unapproved."
  end

  batch_action :approve do |ids|
    ProjectUser.find(ids).each do |project_user|
      project_user.update(is_approved: true)
    end
    redirect_to collection_path, alert: "The relation have been approved."
  end

  filter :project_id
  filter :user_id
  filter :is_approved

  index do
    selectable_column
    column :project_id
    column :user_id
    column do |project_user|
      if project_user.is_approved?
        link_to 'Unpprove', unapprove_admin_project_user_path(project_user), method: :patch
      else
        link_to 'Approve', approve_admin_project_user_path(project_user), method: :patch
      end
    end
    actions
  end
end
