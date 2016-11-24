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

class Featured < ApplicationRecord
  belongs_to :featurable, polymorphic: true
end

