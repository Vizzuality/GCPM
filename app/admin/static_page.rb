ActiveAdmin.register StaticPage do
  menu parent: 'Administration', priority: 1
  permit_params :name, :slug, :body, :path_prefix, :published

  filter :name

  index do
    selectable_column
    column :id
    column :name
    column :slug
    column :path_prefix
    column :published
    actions
  end

  form do |f|
    semantic_errors
    f.inputs do
      f.input :published
      f.input :name
      f.input :slug
      f.input :path_prefix
      f.input :body
    end
    f.actions
  end
end
