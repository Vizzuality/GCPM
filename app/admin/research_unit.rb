ActiveAdmin.register ResearchUnit do
  menu parent: "Entities"

  permit_params :address_id, :project_id
  actions :all, except: [:edit]


  index do
    selectable_column
    column :organization do |o|
      o.organization.name if o.organization
    end
    column :investigator
    actions
  end

  filter :investigator_name, as: :string

   form do |f|
    f.semantic_errors
    f.inputs do
      f.input :investigator_id, as: :select, collection: Investigator.all.map{ |i| [i.name, i.id] }
      f.input :address_id, as: :select, collection: Address.eager_load(:organization).order('organizations.name').map{ |i| ["#{i.organization.name} - #{i.country_name}", i.id] }
    end
    f.actions
  end

end
