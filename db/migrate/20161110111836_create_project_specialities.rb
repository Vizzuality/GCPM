class CreateProjectSpecialities < ActiveRecord::Migration[5.0]
  def change
    create_table :projects_specialities do |t|
      t.integer :project_id
      t.integer :speciality_id

      t.timestamps
    end
    add_index :projects_specialities, :project_id
    add_index :projects_specialities, :speciality_id
  end
end
