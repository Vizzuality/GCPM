class CreateNotifications < ActiveRecord::Migration[5.0]
  def change
    create_table :notifications do |t|
      t.belongs_to :user, index: true, foreign_key: true
      t.references :notificable, polymorphic: true
      t.text       :summary
      t.integer    :counter, default: 1
      t.datetime   :emailed_at

      t.timestamps
    end
  end
end
