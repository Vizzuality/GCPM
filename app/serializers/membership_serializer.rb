# == Schema Information
#
# Table name: memberships
#
#  id               :integer          not null, primary key
#  project_id       :integer
#  research_unit_id :integer
#  membership_type  :integer          default("secondary")
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class MembershipSerializer < ActiveModel::Serializer
  attributes :id, :membership_type

  has_one :investigator
  has_one :organization
  has_one :address

  def address
    object.address
  end

  def investigator
    investigator        = {}
    investigator[:id]   = object.investigator.try(:id)
    investigator[:name] = object.investigator.try(:name)
    investigator
  end

  def organization
    organization        = {}
    organization[:id]   = object.organization.try(:id)
    organization[:name] = object.organization.try(:name)
    organization
  end

  def address
    address          = {}
    address[:id]     = object.address.try(:id)
    address[:line_1] = object.address.try(:line_1)
    address
  end
end
