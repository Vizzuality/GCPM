class CreatePictures < ActiveRecord::Migration[5.0]
  def change
    create_table :pictures do |t|
      t.string  :title
      t.text    :description
      t.string  :url
      t.boolean :published
      t.string  :image, null: false

      t.timestamps
    end
  end
end
