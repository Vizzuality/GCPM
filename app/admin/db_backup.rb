ActiveAdmin.register DbBackup do
  menu parent: "Administration", priority: 2
  permit_params :notes

  filter :notes
  filter :created_at

  action_item :restore, only: :show do
    link_to 'Restore this backup', restore_admin_db_backup_path, data: { confirm: 'Are you sure?' }
  end
  action_item :download, only: :show do
    link_to 'Download this backup', download_admin_db_backup_path
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

  member_action :download, method: :get do
    file_name = "#{Rails.root}/db_backups/full_#{resource.file_name}"
    send_file(file_name, type: "application/octet-stream", disposition: "attachment")
  end
end
