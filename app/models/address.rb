# == Schema Information
#
# Table name: addresses
#
#  id               :integer          not null, primary key
#  city             :string
#  country          :string
#  country_code     :string
#  latitude         :float
#  longitude        :float
#  line_1           :text
#  line_2           :text
#  line_3           :text
#  postcode         :string
#  primary          :boolean          default(FALSE)
#  state            :string
#  state_code       :string
#  geonames_city_id :integer
#  organization_id  :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class Address < ApplicationRecord
  belongs_to :organization
  has_many :research_units
  has_many :investigators, through: :research_units
end
