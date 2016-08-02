class ChangeColumnAddressesCountryCountryName < ActiveRecord::Migration[5.0]
  def change
    rename_column :addresses, :country, :country_name
  end
end
