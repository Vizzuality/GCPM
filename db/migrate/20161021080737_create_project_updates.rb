class CreateProjectUpdates < ActiveRecord::Migration[5.0]
  def change
    create_table :project_updates do |t|
      t.string :title
      t.text :body
      t.integer :project_id

      t.timestamps
    end
    add_index :project_updates, :project_id
  end
end
