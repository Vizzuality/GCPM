class AddLayerGroupNameToSuperGroups < ActiveRecord::Migration[5.0]
  def change
    add_column :layer_groups, :layer_group_name, :string
  end
end
