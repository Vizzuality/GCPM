# == Schema Information
#
# Table name: investigators
#
#  id          :integer          not null, primary key
#  name        :string
#  email       :string
#  website     :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :integer
#  is_approved :boolean          default(FALSE)
#  slug        :string
#

class InvestigatorSerializer < ActiveModel::Serializer
  attributes :id, :name, :user_id

  has_many :organizations
  has_many :addresses
end
