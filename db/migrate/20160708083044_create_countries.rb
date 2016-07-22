class CreateCountries < ActiveRecord::Migration[5.0]
  def change
    create_table :countries do |t|
      t.string :country_name
      t.string :region_name
      t.string :country_iso
      t.string :region_iso
      t.string :country_centroid
      t.string :region_centroid

      t.timestamps
    end
  end
end
