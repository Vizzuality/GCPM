class InvestigatorSerializer < ActiveModel::Serializer
  attributes :id, :name

  has_many :organizations
  has_many :addresses
end
