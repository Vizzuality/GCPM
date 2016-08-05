class InvestigatorSerializer < ActiveModel::Serializer
  attributes :id

  has_many :organizations
  has_many :addresses
end
