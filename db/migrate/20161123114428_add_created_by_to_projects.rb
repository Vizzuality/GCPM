class AddCreatedByToProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :created_by, :integer
  end
end
