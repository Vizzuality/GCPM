class CreateOrganizationTypes < ActiveRecord::Migration[5.0]
  def change
    create_table :organization_types do |t|
      t.string :name
    end
  end
end
