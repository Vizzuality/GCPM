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
  has_one :address,      through: :research_unit
  has_one :organization, through: :research_unit

  after_save :cleanup_memberships

  validates :project_id, uniqueness: { scope: :research_unit_id }

  accepts_nested_attributes_for :research_unit

  def address
    if research_unit && research_unit.address.present?
      self.research_unit.address
    else
      {}
    end
  end

  private

    def cleanup_memberships
      invalid_membership = Membership.where(research_unit_id: nil)
      invalid_membership.delete_all if invalid_membership.any?
    end
end
