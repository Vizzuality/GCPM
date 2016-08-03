ActiveAdmin.register OrganizationType do
  menu parent: "Entities"

  index do
    selectable_column
    column :id
    column :name
  end
  filter :name
end
