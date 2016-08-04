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
end
