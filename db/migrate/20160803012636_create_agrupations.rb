class CreateAgrupations < ActiveRecord::Migration[5.0]
  def change
    create_table :agrupations do |t|
      t.references :layer
      t.references :layer_group
      t.timestamps
    end
  end
end
