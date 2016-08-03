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

require 'rails_helper'

RSpec.describe DbBackup, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
