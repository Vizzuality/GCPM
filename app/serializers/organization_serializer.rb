class OrganizationSerializer < ActiveModel::Serializer
  attributes :id, :name

  has_many :addresses
end
