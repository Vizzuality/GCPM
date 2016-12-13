class AddNotificationsCounterCacheToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :notifications_count,  :integer, default: 0
    add_column :users, :notifications_mailer, :boolean, default: true
  end
end
