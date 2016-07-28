# == Schema Information
#
# Table name: research_units
#
#  id              :integer          not null, primary key
#  address_id      :integer
#  investigator_id :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

FactoryGirl.define do
  factory :research_unit do
    investigator_id 1
    address_id
  end
end
