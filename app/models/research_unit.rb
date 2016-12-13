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

  before_create :check_address,           if: 'address_id.blank?'
  after_create  :notify_users_for_update, if: 'organization.present? && investigator.present?'
  after_save    :cleanup_research_units

  validates :investigator_id, uniqueness: { scope: :address_id }

  accepts_nested_attributes_for :investigator
  accepts_nested_attributes_for :address

  def self.check_id(investigator_id, address_id)
    ResearchUnit.find_by(investigator_id: investigator_id, address_id: address_id)
  end

  private

    def check_address
      i_address_id    = Investigator.set_by_id_or_slug(self.investigator_id).addresses.first.id
      self.address_id = i_address_id if i_address_id.present?
    end

    def cleanup_research_units
      double_rus = ResearchUnit.where(investigator_id: self.investigator_id, address_id: self.address_id)
      if double_rus.size == 2
        double_rus[1].delete
      end
      invalid_ru = ResearchUnit.where(address_id: nil)
      invalid_ru.delete_all if invalid_ru.any?
    end

    def notify_users_for_update
      users_organization = ActivityFeed.where(actionable_type: 'Organization', actionable_id: organization.id, action: 'following').pluck(:user_id)
      users_investigator = ActivityFeed.where(actionable_type: 'Investigator', actionable_id: investigator.id, action: 'following').pluck(:user_id)
      Notification.build(users_organization, investigator, "was added to organization #{organization.name}") if users_organization.any?
      Notification.build(users_investigator, organization, "was added to investigator #{investigator.name}") if users_investigator.any?
    end
end
