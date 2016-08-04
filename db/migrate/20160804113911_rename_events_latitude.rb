class RenameEventsLatitude < ActiveRecord::Migration[5.0]
  def change
    rename_column :events, :latitute, :latitude
  end
end
