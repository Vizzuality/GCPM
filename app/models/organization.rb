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
  belongs_to :organization_type

  has_many :addresses
  has_many :research_units, through: :addresses
  has_many :investigators,  through: :research_units, foreign_key: 'investigator_id'
  has_many :memberships,    through: :research_units
  has_many :projects,       through: :memberships

  has_many :funders
  has_many :funded_projects, through: :funders, source: :project

  accepts_nested_attributes_for :addresses, allow_destroy: true

  validates_presence_of   :name
  validates_uniqueness_of :name
  validates               :email_address, format: { with: Devise.email_regexp }, allow_blank: true, on: :create

  include Sluggable
end
