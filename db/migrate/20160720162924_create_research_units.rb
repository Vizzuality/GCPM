class CreateResearchUnits < ActiveRecord::Migration[5.0]
  def change
    create_table :research_units do |t|
      t.references :address
      t.references :investigator
      t.timestamps
    end
  end
end
