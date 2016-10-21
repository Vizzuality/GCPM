# == Schema Information
#
# Table name: project_updates
#
#  id         :integer          not null, primary key
#  title      :string
#  body       :text
#  project_id :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'rails_helper'

RSpec.describe ProjectUpdate, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
