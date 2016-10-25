class CreateProjectUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :project_users do |t|
      t.integer :project_id,  index: true
      t.integer :user_id,     index: true
      t.boolean :is_approved, default: false

      t.timestamps
    end
    add_index :project_users, [:project_id, :user_id], unique: true
  end
end
