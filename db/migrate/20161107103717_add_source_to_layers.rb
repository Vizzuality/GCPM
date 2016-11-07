class AddSourceToLayers < ActiveRecord::Migration[5.0]
  def change
    add_column :layers, :source, :text
  end
end
