class MembershipSerializer < ActiveModel::Serializer
  attributes :id, :membership_type
  has_one :investigator
  has_one :organization
  has_one :address

  def address
    object.address
  end
end
