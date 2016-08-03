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

class Agrupation < ApplicationRecord
  belongs_to :layer
  belongs_to :layer_group
  validates_uniqueness_of :layer, scope: :layer_group
end
