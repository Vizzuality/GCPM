# == Schema Information
#
# Table name: organization_types
#
#  id   :integer          not null, primary key
#  name :string
#

class OrganizationTypeSerializer < ActiveModel::Serializer
  attributes :id, :name
end
