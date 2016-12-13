ActiveAdmin.register Picture do
  extend Featurable
  menu parent: "Entities", priority: 2

  permit_params :title, :description, :url, :published, :image

  filter :title
  filter :description
  filter :url
  filter :published

  batch_action :unpublish do |ids|
    Picture.find(ids).each do |picture|
      picture.update(published: false)
    end
    redirect_to collection_path, alert: "The relation have been unpublished."
  end

  batch_action :publish do |ids|
    Picture.find(ids).each do |picture|
      picture.update(published: true)
    end
    redirect_to collection_path, alert: "The relation have been published."
  end

  index do
    selectable_column
    column :id
    column :title
    column :published
    column :image do |picture|
      image_tag picture.image_url(:thumb)
    end

    actions do |obj|
      if obj.featured?
        link_to('Unfeature', unfeature_admin_picture_path(obj))
      else
        link_to('Feature', feature_admin_picture_path(obj))
      end
    end
  end

  show do
    attributes_table do
      row :title
      row :description
    end
    active_admin_comments
  end

  sidebar 'Picture', only: :show do
    attributes_table_for picture do
      row('Published?') { |p| status_tag p.published? }
      if picture.featured?
        row 'Featured' do
          link_to('Unfeature', unfeature_admin_picture_path(picture))
        end
      else
        row 'Unfeatured' do
          link_to('Feature', feature_admin_picture_path(picture))
        end
      end
      row :image do
        image_tag picture.image_url(:thumb)
      end
    end
  end

  form do |f|
    semantic_errors
    f.inputs do
      f.input :title
      f.input :description
      f.input :url
      f.input :image
      f.input :published
    end
    f.actions
  end
end
