# == Schema Information
#
# Table name: organization_types
#
#  id   :integer          not null, primary key
#  name :string
#

class OrganizationType < ApplicationRecord
  has_many :organizations
end
