ActiveAdmin.register Investigator do
  menu parent: "Entities"

  permit_params :name, :email, :website, :user_id, :is_approved

  filter :name
  filter :position_title

  member_action :approve, method: :patch do
    if resource.update(is_approved: true)
      UserMailer.user_relation_email(resource.user.name, resource.user.email, resource.name, 'approved').deliver_later
      redirect_back fallback_location: admin_root_path, notice: 'The relation have been approved.'
    end
  end

  member_action :unapprove, method: :patch do
    if resource.update(is_approved: false)
      UserMailer.user_relation_email(resource.user.name, resource.user.email, resource.name, 'unapproved').deliver_later
      redirect_back fallback_location: admin_root_path, notice: 'The relation have been unapproved.'
    end
  end

  member_action :delete_relation, method: :patch do
    UserMailer.user_relation_email(resource.user.name, resource.user.email, resource.name, 'removed').deliver_later
    if resource.update(user_id: nil)
      redirect_back fallback_location: admin_root_path, notice: 'The relation have been removed.'
    end
  end

  index do
    selectable_column
    column :id
    column :name
    column :email
    column :website
    actions
  end

  form do |f|
    f.semantic_errors
    f.inputs do
      f.input :name
      f.input :email
      f.input :website
    end
  end

end
