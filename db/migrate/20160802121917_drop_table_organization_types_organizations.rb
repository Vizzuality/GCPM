class DropTableOrganizationTypesOrganizations < ActiveRecord::Migration[5.0]
  def change
    drop_table :organization_types_organizations
  end
end
