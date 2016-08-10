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
    investigator[:id]   = object.investigator.id
    investigator[:name] = object.investigator.name
    investigator
  end

  def organization
    organization        = {}
    organization[:id]   = object.organization.id
    organization[:name] = object.organization.name
    organization
  end

  def address
    address          = {}
    address[:id]     = object.address.id
    address[:line_1] = object.address.line_1
    address
  end
end
