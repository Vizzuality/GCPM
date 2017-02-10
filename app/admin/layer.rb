ActiveAdmin.register Layer do
  menu parent: "Map", priority: 1

  permit_params :layer_group_id, :name, :slug, :layer_type, :zindex,
                :active, :order, :color, :info, :interactivity, :query,
                :layer_provider, :css, :published, :opacity, :locate_layer,
                :icon_class, :legend, :source

  form do |f|
    f.semantic_errors
    f.inputs 'Layer Details' do
      f.input :name
      f.input :slug
      f.input :layer_type, as: :select, collection: ['layer']
      f.input :opacity
      f.input :zindex
      f.input :active
      f.input :order
      f.input :info
      f.input :interactivity
      f.input :query
      f.input :layer_provider, as: :select, collection: ['raster', 'cartodb']
      f.input :css
      f.input :locate_layer
      f.input :legend
      f.input :source
    end
    f.actions
  end

  index do
    selectable_column
    column :id
    column :name
    column :provider
    column :download
    column :css
    column :query
    column :info
    column :updated_at
    actions
  end
end
