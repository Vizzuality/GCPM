class CreateDbBackups < ActiveRecord::Migration[5.0]
  def change
    create_table :db_backups do |t|
      t.text :notes
      t.string :file_name
      t.timestamps
    end
  end
end
