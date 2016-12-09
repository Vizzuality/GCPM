class CreateActivityFeeds < ActiveRecord::Migration[5.0]
  def change
    create_table :activity_feeds do |t|
      t.integer :user_id
      t.string :action
      t.belongs_to :actionable, polymorphic: true
      t.timestamps
    end

    add_index :activity_feeds, [:actionable_id, :actionable_type, :action, :user_id], name: 'act_id_type_action_user_on_activity', unique: true
    add_index :activity_feeds, :user_id
  end
end
