# == Schema Information
#
# Table name: organizations
#
#  id                   :integer          not null, primary key
#  name                 :string
#  acronym              :string
#  grid_id              :string
#  email_address        :string
#  established          :integer
#  organization_type_id :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  slug                 :string
#

require 'rails_helper'

RSpec.describe Organization, type: :model do
  before :each do
    @organization = create(:organization, name: 'Test organization')
  end

  context "Valid investigator" do
    it 'Slug presentation' do
      expect(@organization).to      be_valid
      expect(@organization.slug).to be_present
      expect(@organization.slug).to eq('test-organization')
    end
  end
end
