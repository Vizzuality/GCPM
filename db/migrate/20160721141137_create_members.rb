class CreateMembers < ActiveRecord::Migration[5.0]
  def change
    create_table :members do |t|
      t.integer :project_id
      t.integer :organization_id
      t.integer :investigator_id
      t.integer :membership_type

      t.timestamps
    end
    add_index :members, :project_id
    add_index :members, :organization_id
    add_index :members, :investigator_id
    add_index :members, :membership_type
  end
end
