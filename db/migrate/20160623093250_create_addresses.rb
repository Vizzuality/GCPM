class CreateAddresses < ActiveRecord::Migration[5.0]
  def change
    create_table :addresses do |t|
      t.string :city
      t.string :country
      t.string :country_iso
      t.float :latitude
      t.float :longitude
      t.text :address
      t.string :postcode
      t.boolean :primary, default: false
      t.string :state
      t.string :state_code
      t.string :geonames_city
      t.integer :organization_id

      t.timestamps
    end
    add_index :addresses, :organization_id
  end
end
