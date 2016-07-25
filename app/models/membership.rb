# == Schema Information
#
# Table name: members
#
#  id              :integer          not null, primary key
#  project_id      :integer
#  organization_id :integer
#  investigator_id :integer
#  membership_type :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class Membership < ApplicationRecord
  belongs_to :project
  belongs_to :investigator
  belongs_to :organization
  enum membership_type: [:main, :secondary, :funding]
end
