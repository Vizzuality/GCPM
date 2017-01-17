class AddInnerPageToWidgets < ActiveRecord::Migration[5.0]
  def change
    add_column :widgets, :inner_page, :string
  end
end
