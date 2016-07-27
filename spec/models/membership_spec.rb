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

require 'rails_helper'

RSpec.describe Membership, :type => :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
