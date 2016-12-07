# == Schema Information
#
# Table name: pictures
#
#  id          :integer          not null, primary key
#  title       :string
#  description :text
#  url         :string
#  published   :boolean
#  image       :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

require 'rails_helper'

RSpec.describe Picture, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
