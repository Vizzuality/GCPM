ActiveAdmin.register DbBackup do
  menu parent: "Administration", priority: 2
  permit_params :notes

  filter :notes
  filter :created_at

  action_item :restore, only: :show do
    link_to 'Restore this backup', restore_admin_db_backup_path, data: {confirm: 'Are you sure?'}
  end

  index do
    selectable_column
    column :id
    column :notes
    column :file_name
    column :created_at
    actions
  end

  form do |f|
    f.semantic_errors
    f.inputs do
      f.input :notes
    end
    f.actions
  end

  member_action :restore, method: :get do
    resource.restore_db!
    redirect_to resource_path, notice: "Backup restored!"
  end

# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
#
# permit_params :list, :of, :attributes, :on, :model
#
# or
#
# permit_params do
#   permitted = [:permitted, :attributes]
#   permitted << :other if params[:action] == 'create' && current_user.admin?
#   permitted
# end


end
