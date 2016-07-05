ActiveAdmin.register Organization do

  permit_params :name, :acronym, :grid_id, :email_address, :established, :organization_type_id

  filter :name
  filter :acronym
  filter :grid_id
  filter :email_address
  filter :organization_type, as: :select

  index do
    selectable_column
    id_column
    column :name
    column :acronym
    column :email_address
    column :established
    column :organization_type
    actions
  end

  form do |f|
    f.semantic_errors
    f.inputs do
      f.input :name
      f.input :organization_type, as: :select
      f.input :acronym
      f.input :grid_id
      f.input :email_address
      f.input :established
    end
    f.inputs do
      f.has_many :addresses  do |app_f|
        app_f.inputs "addresses" do
          if !app_f.object.nil?
            app_f.input :_destroy, :as => :boolean, :label => "Destroy?"
          end
          app_f.input :city
        end
      end
    end
  end
end
