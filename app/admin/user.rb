ActiveAdmin.register User do
  menu parent: 'Network', priority: 1

  permit_params :email, :name, :position, :twitter_account, :linkedin_account, :pubmed, :role, :is_active

  filter :name
  filter :email
  filter :role, as: :select, collection: [['User', 0], ['Admin', 1]]
  filter :is_active

  index do
    selectable_column
    column :id
    column :name
    column :email
    column :role
    column :is_active
    actions
  end

  form do |f|
    semantic_errors
    f.inputs do
      f.input :email
      f.input :name
      f.input :twitter_account
      f.input :linkedin_account
      f.input :pubmed
      f.input :role
      f.input :is_active
    end
    f.actions
  end
end
