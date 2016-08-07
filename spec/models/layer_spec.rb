# == Schema Information
#
# Table name: layers
#
#  id             :integer          not null, primary key
#  layer_group_id :integer
#  name           :string           not null
#  slug           :string           not null
#  layer_type     :string
#  zindex         :integer
#  active         :boolean
#  order          :integer
#  color          :string
#  info           :text
#  layer_provider :string
#  css            :text
#  interactivity  :text
#  opacity        :float
#  query          :text
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  locate_layer   :boolean          default(FALSE)
#  icon_class     :string
#  published      :boolean          default(TRUE)
#  legend         :text
#

require 'rails_helper'

RSpec.describe Layer, type: :model do
  # pending "add some examples to (or delete) #{__FILE__}"
end
