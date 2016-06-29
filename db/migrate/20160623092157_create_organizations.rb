class CreateOrganizations < ActiveRecord::Migration[5.0]
  def change
    create_table :organizations do |t|
      t.string :name
      t.string :acronym
      t.string :grid_id
      t.integer :organization_type_id

      t.timestamps
    end
    add_index :organizations, :organization_type_id
  end
end
