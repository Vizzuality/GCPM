class AddUniqueIndexForAddressAndInvestigatorOnRu < ActiveRecord::Migration[5.0]
  def change
    add_index :research_units, [:address_id, :investigator_id], unique: true
  end
end
