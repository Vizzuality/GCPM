class AddGridIdToAddresses < ActiveRecord::Migration[5.0]
  def change
    add_column :addresses, :grid_id, :string
  end
end
