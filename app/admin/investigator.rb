ActiveAdmin.register Investigator do

  filter :name
  filter :position_title

  index do
    selectable_column
    column :id
    column :name
    column :email
    column :position_title
    column :website
    actions
  end

end
