# == Schema Information
#
# Table name: investigators
#
#  id             :integer          not null, primary key
#  name           :string
#  email          :string
#  position_title :string
#  website        :text
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class Investigator < ApplicationRecord
  has_many :research_units
  has_many :addresses, through: :research_units
  has_many :organizations, through: :addresses
  has_many :memberships, through: :research_units
  has_many :projects, through: :memberships
  validates_presence_of :name
end
