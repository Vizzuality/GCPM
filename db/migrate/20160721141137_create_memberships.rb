class CreateMemberships < ActiveRecord::Migration[5.0]
  def change
    create_table :memberships do |t|
      t.integer :project_id
      t.integer :research_unit_id
      t.integer :membership_type, default: 1

      t.timestamps
    end
    add_index :memberships, :project_id
    add_index :memberships, :research_unit_id
    add_index :memberships, :membership_type
  end
end
