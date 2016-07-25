class RemoveColumnCountryIsoFromAddresses < ActiveRecord::Migration[5.0]
  def change
    remove_column :addresses, :country_iso
  end
end
