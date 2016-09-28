ActiveAdmin.register DbBackup do
  menu parent: "Administration", priority: 2
  permit_params :notes

  filter :notes
  filter :created_at

  action_item :restore, only: :show do
    link_to 'Restore this backup', restore_admin_db_backup_path, data: { confirm: 'Are you sure?' }
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
end
