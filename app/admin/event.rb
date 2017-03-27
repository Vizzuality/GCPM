ActiveAdmin.register Event do
  extend Featurable
  menu parent: "Entities", priority: 2

  permit_params :title, :description, :website, :excerpt, :participants, :start_date, :end_date, :private, :online, :address, :address2, :city, :country, :state, :latitude, :longitude, :postcode, :user_id

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
      f.input :description, as: :ckeditor
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
      f.input :user_id, as: :select, collection: User.all.map { |u| ["Name: #{u.display_name}, ID: #{u.id}", u.id] }
    end
    f.actions
  end

  csv do
    column(:id)
    column(:title)
    column('creator(name)')    { |event| event.user.display_name if event.user.present? }
    column('creator(user_id)') { |event| event.user.id if event.user.present?           }
    column(:description)
    column(:website)
    column(:excerpt)
    column(:participants)
    column(:start_date)
    column(:end_date)
    column(:private)
    column(:online)
    column(:address)
    column(:address2)
    column(:city)
    column(:country)
    column(:state)
    column(:latitude)
    column(:longitude)
    column(:postcode)
    column(:slug)
    column(:created_at)
    column(:updated_at)
  end
end
