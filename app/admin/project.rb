ActiveAdmin.register Project do
  extend Featurable
  menu parent: "Entities", priority: 1

  permit_params :title, :summary, :project_website, :start_date, :end_date, :status, :user_id

  member_action :unpublish, method: :patch do
    if resource.update(status: 2)
      redirect_to collection_path, notice: 'Project has been unapproved.'
    end
  end

  member_action :publish, method: :patch do
    if resource.update(status: 1)
      redirect_to collection_path, notice: 'Project has been approved.'
    end
  end

  batch_action :published do |ids|
    Project.find(ids).each do |project|
      project.update(status: 1)
    end
    redirect_to collection_path, alert: "Projects has been published."
  end

  filter :project_types
  filter :cancer_types
  filter :title
  filter :summary
  filter :project_website
  filter :start_date
  filter :end_date
  filter :status
  filter :created_at
  filter :updated_at

  index do
    selectable_column
    column :id
    column :title
    column :status
    actions dropdown: true do |obj|
      item 'Unfeature', unfeature_admin_project_path(obj) if obj.featured?
      item 'Feature', feature_admin_project_path(obj) unless obj.featured?
      item 'Unpublish', unpublish_admin_project_path(obj), method: :patch if obj.published?
      item 'Publish', publish_admin_project_path(obj), method: :patch if obj.unpublished?
    end
  end

  form do |f|
    semantic_errors
    f.inputs do
      f.input :title
      f.input :summary, as: :ckeditor
      f.input :project_website
      f.input :start_date, as: :date_picker
      f.input :end_date, as: :date_picker
      f.input :status
    end
    f.actions
  end

end
