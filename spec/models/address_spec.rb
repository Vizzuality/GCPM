# == Schema Information
#
# Table name: addresses
#
#  id               :integer          not null, primary key
#  city             :string
#  country_name     :string
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
#  country_id       :integer
#

require 'rails_helper'

RSpec.describe Address, type: :model do
  # pending "add some examples to (or delete) #{__FILE__}"
end
