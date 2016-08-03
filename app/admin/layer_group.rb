ActiveAdmin.register LayerGroup do
  menu parent: "Map", priority: 2

  permit_params :name, :slug, :category, :active, :order, :info, :layer_group_type, :super_group_id, agrupations_attributes:[:layer_id, :id, :_destroy]
   form do |f|
    f.semantic_errors
    f.inputs "Layers" do
      f.has_many :agrupations, allow_destroy: true do |deg|
        deg.input :layer, as: :select, collection: Layer.order(:name).pluck(:name, :id)
      end
    end
    f.inputs 'Layer Group Details' do
    f.input :name
    f.input :slug
    f.input :active
    f.input :order
    f.input :info
    f.input :layer_group_type, as: :select, collection: %w{group category subcategory subgroup}
    f.input :super_group
    end
    f.actions
  end
  index do
    selectable_column
    column :id
    column :name
    column :layer_group_type
    column :site_scope do |lg|
      SiteScope.find(lg.site_scope_id).name if lg.site_scope_id.present?
    end
    column :layers do |lg|
      lg.layers.map{|l| l.name}.join(", ")
    end
    column :order
    column :updated_at
    actions
  end
end
