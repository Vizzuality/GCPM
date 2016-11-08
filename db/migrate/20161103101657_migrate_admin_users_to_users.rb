class TempUser < User
  def password_required?
    false
  end
end

class MigrateAdminUsersToUsers < ActiveRecord::Migration[5.0]
  def up
    AdminUser.find_each do |admin|
      user = TempUser.where(admin.attributes.except('id').merge(name: 'Admin', role: 'admin')).first_or_initialize
      user.skip_confirmation!
      user.save!
    end
  end

  def down
    AdminUser.find_each do |admin|
      user = User.find_by(email: admin.email)
      user.delete
    end
  end
end
