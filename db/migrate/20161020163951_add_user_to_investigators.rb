class AddUserToInvestigators < ActiveRecord::Migration[5.0]
  def change
    add_reference :investigators, :user, foreign_key: true, index: true
    add_column    :investigators, :is_approved, :boolean, default: false
  end
end
