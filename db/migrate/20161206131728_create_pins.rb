class CreatePins < ActiveRecord::Migration[5.0]
  def change
    create_table :pins do |t|
      t.integer    :post_id
      t.belongs_to :pinable, polymorphic: true
      t.timestamps
    end

    add_index :pins, [:pinable_id, :pinable_type]
  end
end
