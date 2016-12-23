ActiveAdmin.register Widget do
  menu parent: "Graphics", priority: 1
  extend Featurable

  permit_params :name, :slug, :graphic_type, :x_axis, :y_axis, :legend, :source, :query

  form do |f|
    f.semantic_errors
    f.inputs 'Widget Details' do
      f.input :name
      f.input :slug
      f.input :x_axis
      f.input :y_axis
      f.input :legend
      f.input :source
      f.input :query
      f.input :graphic_type, as: :select, collection: ['line', 'map', 'pie', 'bar']
    end
    actions
  end

  index do
    selectable_column
    column :id
    column :name
    column :slug
    column :graphic_type
    actions do |obj|
      if obj.featured?
        link_to("Unfeature", unfeature_admin_widget_path(obj))
      else
        link_to("Feature", feature_admin_widget_path(obj))
      end
    end
  end
end
