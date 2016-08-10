# == Schema Information
#
# Table name: investigators
#
#  id         :integer          not null, primary key
#  name       :string
#  email      :string
#  website    :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class InvestigatorSerializer < ActiveModel::Serializer
  attributes :id, :name

  has_many :organizations
  has_many :addresses
end
