ActiveAdmin.register Organization do
  extend Featurable
  menu parent: "Entities"

  permit_params :name, :acronym, :grid_id, :email_address, :established, :organization_type_id, addresses_attributes: [:city, :country, :primary, :latitude, :longitude, :line_1, :line_2, :line_3, :postcode, :state, :state_code, :_destroy, :id]

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
    actions do |obj|
      if obj.featured?
        link_to("Unfeature", unfeature_admin_organization_path(obj))
      else
        link_to("Feature", feature_admin_organization_path(obj))
      end
    end
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
      f.has_many :addresses, heading: 'Addresses', allow_destroy: true, new_record: true do |address|
        address.input :primary
        address.input :city
        address.input :country, as: :select, collection: Country.all.map{|c| [c.country_name]}
        address.input :latitude
        address.input :longitude
        address.input :line_1, as: :string
        address.input :line_2, as: :string
        address.input :line_3, as: :string
        address.input :postcode
        address.input :state
        address.input :state_code
      end
    end
    f.actions
  end
end
