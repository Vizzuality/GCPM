class AddSlugToProjectsInvestigatorsCancerTypesOrganizationsAndEvents < ActiveRecord::Migration[5.0]
  def up
    add_column :projects,      :slug, :string
    add_column :investigators, :slug, :string
    add_column :cancer_types,  :slug, :string
    add_column :events,        :slug, :string
    add_column :organizations, :slug, :string

    add_index :projects,      :slug, unique: true
    add_index :investigators, :slug, unique: true
    add_index :cancer_types,  :slug, unique: true
    add_index :events,        :slug, unique: true
    add_index :organizations, :slug, unique: true

    Rake::Task['assign:slugs'].invoke unless Rails.env.test?
  end

  def down
    remove_column :projects,      :slug
    remove_column :investigators, :slug
    remove_column :cancer_types,  :slug
    remove_column :events,        :slug
    remove_column :organizations, :slug
  end
end
