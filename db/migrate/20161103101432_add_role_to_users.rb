class AddRoleToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :role, :integer, default: 'user', null: false, comment: 'User role { user: 0, admin: 1 }'
  end
end
