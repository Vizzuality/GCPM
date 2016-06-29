# == Schema Information
#
# Table name: organizations
#
#  id                   :integer          not null, primary key
#  name                 :string
#  acronym              :string
#  grid_id              :string
#  organization_type_id :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#

class Organization < ApplicationRecord
  has_many :addresses
end
