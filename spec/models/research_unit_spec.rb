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

require 'rails_helper'

RSpec.describe ResearchUnit, :type => :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
