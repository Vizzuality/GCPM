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
  has_and_belongs_to_many :addresses
  has_many :organizations, through: :addresses
  has_many :projects, through: :memberships
  has_many :organizations, through: :memberships
end
