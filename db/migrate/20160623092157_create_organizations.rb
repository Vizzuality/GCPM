class CreateOrganizations < ActiveRecord::Migration[5.0]
  def change
    create_table :organizations do |t|
      t.string :name
      t.string :acronym
      t.string :grid_id
      t.string :email_address
      t.integer :established
      t.integer :organization_type_id

      t.timestamps
    end
    add_index :organizations, :organization_type_id
    add_index :organizations, :grid_id
  end
end
