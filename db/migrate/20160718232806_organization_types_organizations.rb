class OrganizationTypesOrganizations < ActiveRecord::Migration[5.0]
  def change
    create_table :organization_types_organizations, id: false do |t|
      t.references :organization
      t.references :organization_type
    end
  end
end
