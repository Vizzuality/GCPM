class CreateStaticPages < ActiveRecord::Migration[5.0]
  def change
    create_table :static_pages do |t|
      t.string  :name
      t.string  :slug
      t.string  :path_prefix
      t.text    :body
      t.boolean :published, default: true

      t.timestamps
    end

    add_index :static_pages, :slug, unique: true
    add_index :static_pages, :path_prefix, unique: true
  end
end
