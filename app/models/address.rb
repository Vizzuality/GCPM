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

class Address < ApplicationRecord
  belongs_to :organization
end
