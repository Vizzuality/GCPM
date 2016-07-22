class ProjectTypesProjects < ActiveRecord::Migration[5.0]
  def change
    create_table :project_types_projects, id: false do |t|
      t.references :project
      t.references :project_type
    end
  end
end
