ActiveAdmin.register Project do
  extend Featurable
  menu parent: "Entities", priority: 1

  permit_params :title, :summary, :project_website, :start_date, :end_date, :status, :user_id

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
    actions do |obj|
      if obj.featured?
        link_to("Unfeature", unfeature_admin_project_path(obj))
      else
        link_to("Feature", feature_admin_project_path(obj))
      end
    end
  end

  form do |f|
    semantic_errors
    f.inputs do
      f.input :title
      f.input :summary
      f.input :project_website
      f.input :start_date, as: :date_picker
      f.input :end_date, as: :date_picker
      f.input :status
    end
    f.actions
  end

end
