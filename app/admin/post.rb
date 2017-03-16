#  id         :integer          not null, primary key
#  title      :string
#  body       :text
#  user_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null

ActiveAdmin.register Post do
  menu parent: "Entities"
  extend Featurable
  permit_params :title, :body, :graphic_type, :x_axis, :y_axis, :legend, :source, :query

  form do |f|
    f.semantic_errors
    f.inputs 'Post Details' do
      f.input :title
      f.input :body, as: :ckeditor
      f.input :user
    end
    actions
  end

  index do
    selectable_column
    column :id
    column :title
    column :user
    actions do |obj|
      if obj.featured?
        link_to("Unfeature", unfeature_admin_post_path(obj))
      else
        link_to("Feature", feature_admin_post_path(obj))
      end
    end
  end

  csv do
    column(:id)
    column(:title)
    column('creator(name)')    { |post| post.user.display_name if post.user.present? }
    column('creator(user_id)') { |post| post.user.id if post.user.present?           }
    column(:body)
  end
end
