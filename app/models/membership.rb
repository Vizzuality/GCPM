# == Schema Information
#
# Table name: memberships
#
#  id              :integer          not null, primary key
#  project_id      :integer
#  organization_id :integer
#  investigator_id :integer
#  membership_type :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  address_id      :integer
#

class Membership < ApplicationRecord
  enum membership_type: [:main, :secondary, :funding]
  belongs_to :project
  belongs_to :investigator
  belongs_to :organization
end
