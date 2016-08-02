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

class Address < ApplicationRecord
  belongs_to :organization
  belongs_to :country
  has_many :research_units
  has_many :investigators, through: :research_units
  before_save :assign_country

  def assign_country
    if self.country.present?
      self.country_name = self.country.country_name
      self.country_code = self.country.country_iso_3
    else
      begin
        self.country = Country.find_by(country_iso_3: self.country_code)
      rescue
      end
    end
  end
end
