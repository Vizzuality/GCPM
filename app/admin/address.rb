ActiveAdmin.register Address do
  menu parent: "Entities"

  permit_params :city, :country, :primary, :latitude, :longitude, :line_1, :line_2, :line_3, :postcode, :state, :state_code, :organization_id
  filter :country
  filter :city
  index do
    selectable_column
    column :id
    column :city
    column :country
    column :organization
    column :primary
  end
  form do |f|
    f.semantic_errors
    f.inputs do
      f.input :organization
      f.input :primary
      f.input :city
      f.input :country, as: :select, collection: Country.all.map{|c| [c.country_name]}
      f.input :latitude
      f.input :longitude
      f.input :line_1, as: :string
      f.input :line_2, as: :string
      f.input :line_3, as: :string
      f.input :postcode
      f.input :state
      f.input :state_code
    end
    f.actions
  end
end
