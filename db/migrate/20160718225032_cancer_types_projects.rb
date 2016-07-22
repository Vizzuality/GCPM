class CancerTypesProjects < ActiveRecord::Migration[5.0]
  def change
    create_table :cancer_types_projects, id: false do |t|
      t.references :project
      t.references :cancer_type
    end
  end
end
