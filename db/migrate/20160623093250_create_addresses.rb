class CreateAddresses < ActiveRecord::Migration[5.0]
  def change
    create_table :addresses do |t|
      t.string :city
      t.string :country
      t.string :country_iso
      t.string :country_code
      t.float :latitude
      t.float :longitude
      t.text :line_1
      t.text :line_2
      t.text :line_3
      t.string :postcode
      t.boolean :primary, default: false
      t.string :state
      t.string :state_code
      t.integer :geonames_city_id
      t.integer :organization_id

      t.timestamps
    end
    add_index :addresses, :organization_id
  end
end
