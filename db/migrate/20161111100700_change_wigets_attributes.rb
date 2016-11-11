class ChangeWigetsAttributes < ActiveRecord::Migration[5.0]
  def change
    remove_column :widgets, :xname
    remove_column :widgets, :xunit
    remove_column :widgets, :yname
    remove_column :widgets, :yunit
    add_column :widgets, :x_axis, :text
    add_column :widgets, :y_axis, :text
  end
end
