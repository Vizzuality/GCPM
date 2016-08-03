# == Schema Information
#
# Table name: db_backups
#
#  id         :integer          not null, primary key
#  notes      :text
#  file_name  :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class DbBackup < ApplicationRecord
  before_save :assign_file_name
  def assign_file_name
    self.file_name = "#{Time.now.to_formatted_s(:rfc822).parameterize}.bak"
  end
  def restore_db!
  end
end
