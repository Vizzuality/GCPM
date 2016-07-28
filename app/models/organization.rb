# == Schema Information
#
# Table name: organizations
#
#  id                   :integer          not null, primary key
#  name                 :string
#  acronym              :string
#  grid_id              :string
#  email_address        :string
#  established          :integer
#  organization_type_id :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#

class Organization < ApplicationRecord
  has_many :addresses
  accepts_nested_attributes_for :addresses, allow_destroy: true
  belongs_to :organization_type
  has_many :research_units, through: :addresses
  has_many :investigators, through: :research_units, foreign_key: 'investigator_id'
  has_many :memberships, through: :research_units
  has_many :projects, through: :memberships
end
