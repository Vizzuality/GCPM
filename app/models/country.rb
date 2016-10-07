# == Schema Information
#
# Table name: countries
#
#  id               :integer          not null, primary key
#  country_name     :string
#  region_name      :string
#  country_iso      :string
#  region_iso       :string
#  country_centroid :string
#  region_centroid  :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  country_iso_3    :string
#

class Country < ApplicationRecord
  has_many :addresses
  def self.names
    Country.all.order(:country_name).pluck(:country_name)
  end
end
