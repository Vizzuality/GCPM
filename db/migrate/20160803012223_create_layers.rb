class CreateLayers < ActiveRecord::Migration[5.0]
  def change
    create_table :layers do |t|
      t.integer  "layer_group_id"
      t.string   "name",                                      null: false
      t.string   "slug",                                      null: false
      t.string   "layer_type"
      t.integer  "zindex"
      t.boolean  "active"
      t.integer  "order"
      t.string   "color"
      t.text     "info"
      t.string   "layer_provider"
      t.text     "css"
      t.text     "interactivity"
      t.float    "opacity"
      t.text     "query"
      t.datetime "created_at",                                null: false
      t.datetime "updated_at",                                null: false
      t.boolean  "locate_layer",              default: false
      t.string   "icon_class"
      t.boolean  "published",                 default: true
      t.text     "legend"
      t.timestamps
    end
  end
end
