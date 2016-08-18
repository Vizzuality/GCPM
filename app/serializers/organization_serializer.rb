# == Schema Information
#
# Table name: organizations
#
#  id                   :integer          not null, primary key
#  name                 :string
#  acronym              :string
#  grid_id              :string
#  email_address        :string
#  established          :integer
#  organization_type_id :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#

class OrganizationSerializer < ActiveModel::Serializer
  attributes :id, :name

  has_many :addresses
end
