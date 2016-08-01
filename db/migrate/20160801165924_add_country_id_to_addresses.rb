class AddCountryIdToAddresses < ActiveRecord::Migration[5.0]
  def change
    add_column :addresses, :country_id, :integer
    add_index :addresses, :country_id
  end
end
