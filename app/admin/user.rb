ActiveAdmin.register User do
  menu parent: 'Network', priority: 1

  permit_params :email, :name, :position, :twitter_account, :linkedin_account, :pubmed

  filter :name
  filter :email

  index do
    selectable_column
    column :id
    column :name
    column :email
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
    end
    f.actions
  end
end
