class AddressesInvestigators < ActiveRecord::Migration[5.0]
  def change
    create_table :addresses_investigators, id: false do |t|
      t.references :address
      t.references :investigator
    end
  end
end
