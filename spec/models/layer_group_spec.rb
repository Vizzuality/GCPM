# == Schema Information
#
# Table name: layer_groups
#
#  id               :integer          not null, primary key
#  name             :string
#  super_group_id   :integer
#  slug             :string
#  layer_group_type :string
#  category         :string
#  active           :boolean
#  order            :integer
#  info             :text
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

require 'rails_helper'

RSpec.describe LayerGroup, type: :model do
  # pending "add some examples to (or delete) #{__FILE__}"
end
