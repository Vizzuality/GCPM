class AddAddressIdToMemberships < ActiveRecord::Migration[5.0]
  def change
    add_column :memberships, :address_id, :integer
    add_index :memberships, :address_id
  end
end
