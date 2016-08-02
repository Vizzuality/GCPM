# == Schema Information
#
# Table name: memberships
#
#  id               :integer          not null, primary key
#  project_id       :integer
#  research_unit_id :integer
#  membership_type  :integer          default("secondary")
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class Membership < ApplicationRecord
  enum membership_type: [:main, :secondary]

  belongs_to :project
  belongs_to :research_unit

  has_one :investigator, through: :research_unit
  has_one :organization, through: :research_unit

  validates_presence_of :project_id, :research_unit_id
  validates :project_id, uniqueness: { scope: :research_unit_id }
end
