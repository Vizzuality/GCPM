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

require 'rails_helper'

RSpec.describe Funder, type: :model do
  # pending "add some examples to (or delete) #{__FILE__}"
end
