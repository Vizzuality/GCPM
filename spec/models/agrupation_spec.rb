# == Schema Information
#
# Table name: agrupations
#
#  id             :integer          not null, primary key
#  layer_id       :integer
#  layer_group_id :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

require 'rails_helper'

RSpec.describe Agrupation, type: :model do
  # pending "add some examples to (or delete) #{__FILE__}"
end
