class CreateWidgets < ActiveRecord::Migration[5.0]
  def change
    create_table :widgets do |t|
      t.string :name
      t.string :slug
      t.string :xname
      t.string :xunit
      t.string :yname
      t.string :yunit
      t.string :graphic_type
      t.text :legend
      t.text :source
      t.text :query

      t.timestamps
    end
  end
end
