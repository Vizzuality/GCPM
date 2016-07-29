class AddFieldsToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :name, :string
    add_column :users, :position, :string
    add_column :users, :twitter_account, :string
    add_column :users, :linkedin_account, :string
    add_column :users, :pubmed, :string
  end
end
