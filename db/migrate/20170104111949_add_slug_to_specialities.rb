class AddSlugToSpecialities < ActiveRecord::Migration[5.0]
  def up
    add_column :specialities, :slug, :string
    add_index  :specialities, :slug, unique: true

    Rake::Task['assign:slugs'].invoke unless Rails.env.test?
  end

  def down
    remove_column :specialities,  :slug
  end
end
