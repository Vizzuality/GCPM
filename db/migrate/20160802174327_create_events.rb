class CreateEvents < ActiveRecord::Migration[5.0]
  def change
    create_table :events do |t|
      t.string :title
      t.text :description
      t.text :website
      t.text :excerpt
      t.text :participants
      t.date :start_date
      t.date :end_date
      t.boolean :private
      t.boolean :online
      t.text :address
      t.text :address2
      t.string :city
      t.string :country
      t.string :state
      t.float :latitute
      t.float :longitude
      t.string :postcode

      t.timestamps
    end
  end
end
