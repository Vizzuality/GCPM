class CreateInvestigators < ActiveRecord::Migration[5.0]
  def change
    create_table :investigators do |t|
      t.string :name
      t.string :email
      t.text :website

      t.timestamps
    end
  end
end
