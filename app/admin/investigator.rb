ActiveAdmin.register Investigator do
  menu parent: "Entities"

  permit_params :name, :email, :website

  filter :name
  filter :position_title

  index do
    selectable_column
    column :id
    column :name
    column :email
    column :website
    actions
  end

  form do |f|
    f.semantic_errors
    f.inputs do
      f.input :name
      f.input :email
      f.input :website
    end
  end

end
