# == Schema Information
#
# Table name: memberships
#
#  id               :integer          not null, primary key
#  project_id       :integer
#  research_unit_id :integer
#  membership_type  :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  address_id       :integer
#

class Membership < ApplicationRecord
  enum membership_type: [:main, :secondary, :funding]
  belongs_to :project
  belongs_to :research_unit
  has_one :investigator, through: :research_unit
  has_one :organization, through: :research_unit
end
