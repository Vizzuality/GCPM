class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :title

  has_many :investigators
  has_many :organizations
end
