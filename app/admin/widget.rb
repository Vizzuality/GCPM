ActiveAdmin.register Widget do
  menu parent: "Graphics", priority: 1

  permit_params :name, :slug, :graphic_type, :xname, :xunit, :yname, :yunit, :legend, :source, :query

  form do |f|
    f.semantic_errors
    f.inputs 'Widget Details' do
      f.input :name
      f.input :slug
      f.input :xname
      f.input :xunit
      f.input :yname
      f.input :yunit
      f.input :legend
      f.input :source
      f.input :query
      f.input :graphic_type, as: :select, collection: ['line', 'map', 'pie']
    end
    f.actions
  end

  index do
    selectable_column
    column :id
    column :name
    column :slug
    column :graphic_type
    actions
  end
end
