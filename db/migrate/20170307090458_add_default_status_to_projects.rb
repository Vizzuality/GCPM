class AddDefaultStatusToProjects < ActiveRecord::Migration[5.0]
  def change
    change_column_default :projects, :status, 0
  end
end
