# == Schema Information
#
# Table name: addresses
#
#  id              :integer          not null, primary key
#  city            :string
#  country         :string
#  country_iso     :string
#  latitude        :float
#  longitude       :float
#  address         :text
#  postcode        :string
#  primary         :boolean          default(FALSE)
#  state           :string
#  state_code      :string
#  geonames_city   :string
#  organization_id :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

require 'rails_helper'

RSpec.describe Address, :type => :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
