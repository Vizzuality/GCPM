class RemoveRuInexUnique < ActiveRecord::Migration[5.0]
  def change
    remove_index :research_units, name: 'index_research_units_on_address_id_and_investigator_id'
  end
end
