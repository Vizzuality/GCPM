class CreateFeatureds < ActiveRecord::Migration[5.0]
  def change
    create_table :featureds do |t|
      t.integer :featurable_id
      t.string :featurable_type
      t.integer :weight, default: 0

      t.timestamps
    end
    add_index :featureds, [:featurable_id, :featurable_type]
  end
end
