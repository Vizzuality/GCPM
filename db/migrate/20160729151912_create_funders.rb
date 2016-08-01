class CreateFunders < ActiveRecord::Migration[5.0]
  def change
    create_table :funders do |t|
      t.integer :organization_id
      t.integer :project_id

      t.timestamps
    end
    add_index :funders, :organization_id
    add_index :funders, :project_id
  end
end
