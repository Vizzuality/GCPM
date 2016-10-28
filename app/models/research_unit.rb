# == Schema Information
#
# Table name: research_units
#
#  id              :integer          not null, primary key
#  address_id      :integer
#  investigator_id :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class ResearchUnit < ApplicationRecord
  belongs_to :investigator
  belongs_to :address

  has_many :memberships
  has_many :projects,     through: :memberships
  has_one  :organization, through: :address

  before_create :check_address, if: 'address_id.blank?'
  after_save    :cleanup_research_units

  validates :investigator_id, uniqueness: { scope: :address_id }

  accepts_nested_attributes_for :investigator
  accepts_nested_attributes_for :address

  def self.check_id(investigator_id, address_id)
    ResearchUnit.find_by(investigator_id: investigator_id, address_id: address_id)
  end

  private

    def check_address
      i_address_id    = Investigator.find(self.investigator_id).addresses.first.id
      self.address_id = i_address_id if i_address_id.present?
    end

    def cleanup_research_units
      double_rus = ResearchUnit.where(investigator_id: self.investigator_id, address_id: self.address_id)
      if double_rus.size == 2
        double_rus[1].delete
      end
      ResearchUnit.where(address_id: nil).delete_all
    end
end
