# == Schema Information
#
# Table name: featureds
#
#  id              :integer          not null, primary key
#  featurable_id   :integer
#  featurable_type :string
#  weight          :integer          default(0)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

require 'rails_helper'

RSpec.describe Featured, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
