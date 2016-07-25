class CreateMemberships < ActiveRecord::Migration[5.0]
  def change
    create_table :memberships do |t|
      t.integer :project_id
      t.integer :organization_id
      t.integer :investigator_id
      t.integer :membership_type

      t.timestamps
    end
    add_index :memberships, :project_id
    add_index :memberships, :organization_id
    add_index :memberships, :investigator_id
    add_index :memberships, :membership_type
  end
end
