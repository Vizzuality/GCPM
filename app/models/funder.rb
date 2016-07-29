# == Schema Information
#
# Table name: funders
#
#  id              :integer          not null, primary key
#  organization_id :integer
#  project_id      :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class Funder < ApplicationRecord
  belongs_to :project
  belongs_to :organization
  validates_presence_of :organization_id, :project_id
  validates :organization_id, uniqueness: { scope: :project_id }
end

