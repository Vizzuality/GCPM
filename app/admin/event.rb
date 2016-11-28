ActiveAdmin.register Event do
  extend Featurable
  menu parent: "Entities", priority: 2

  permit_params :title, :description, :website, :excerpt, :participants, :start_date, :end_date, :private, :online, :address, :address2, :city, :country, :state, :latitude, :longitude, :postcode

  index do
    selectable_column
    column :id
    column :title
    column :start_date
    column :end_date
    actions do |obj|
      if obj.featured?
        link_to("Unfeature", unfeature_admin_event_path(obj))
      else
        link_to("Feature", feature_admin_event_path(obj))
      end
    end
  end

  form do |f|
    f.semantic_errors
    f.inputs do
      f.input :title
      f.input :description
      f.input :website, as: :string
      f.input :excerpt
      f.input :participants
      f.input :start_date, as: :date_picker
      f.input :end_date, as: :date_picker
      f.input :private
      f.input :online
      f.input :address, as: :string
      f.input :address2
      f.input :city
      f.input :country, as: :select, collection: Country.names
      f.input :state
      f.input :postcode
      f.input :latitude
      f.input :longitude
    end
    f.actions
  end
end
