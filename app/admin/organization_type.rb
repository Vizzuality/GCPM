ActiveAdmin.register OrganizationType do

  index do
    selectable_column
    column :id
    column :name
  end
  filter :name
end
