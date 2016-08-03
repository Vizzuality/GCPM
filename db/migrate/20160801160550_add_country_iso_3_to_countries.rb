class AddCountryIso3ToCountries < ActiveRecord::Migration[5.0]
  def change
    add_column :countries, :country_iso_3, :string
  end
end
