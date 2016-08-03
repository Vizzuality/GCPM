class CreateLayerGroups < ActiveRecord::Migration[5.0]
  def change
    create_table :layer_groups do |t|
      t.string   "name"
      t.integer  "super_group_id"
      t.string   "slug"
      t.string   "layer_group_type"
      t.string   "category"
      t.boolean  "active"
      t.integer  "order"
      t.text     "info"
      t.timestamps
    end
  end
end
