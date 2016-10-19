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

class ResearchUnit < ApplicationRecord
  belongs_to :investigator
  belongs_to :address

  has_many :memberships
  has_many :projects,     through: :memberships
  has_one  :organization, through: :address

  accepts_nested_attributes_for :investigator
  accepts_nested_attributes_for :address

  def self.check_id(investigator_id, address_id)
    ResearchUnit.find_by(investigator_id: investigator_id, address_id: address_id)
  end
end
