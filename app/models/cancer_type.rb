# == Schema Information
#
# Table name: cancer_types
#
#  id          :integer          not null, primary key
#  name        :string
#  description :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class CancerType < ApplicationRecord
end
