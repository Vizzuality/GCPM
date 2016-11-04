# == Schema Information
#
# Table name: cancer_types
#
#  id          :integer          not null, primary key
#  name        :string
#  description :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  slug        :string
#

require 'rails_helper'

RSpec.describe CancerType, type: :model do
  before :each do
    @cancer_type = create(:cancer_type, name: 'Test type')
  end

  context "Valid investigator" do
    it 'Slug presentation' do
      expect(@cancer_type).to      be_valid
      expect(@cancer_type.slug).to be_present
      expect(@cancer_type.slug).to eq('test-type')
    end
  end
end
