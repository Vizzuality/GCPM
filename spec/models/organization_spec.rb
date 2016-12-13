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

  context 'For post relations' do
    before :each do
      @post         = create(:post, user: @user)
      @project      = create(:project)
      @organization = create(:organization)
      create(:pin, pinable: @project, post: @post)
      create(:pin, pinable: @organization, post: @post)
    end

    it 'Pins count' do
      expect(@project.pins.size).to       eq(1)
      expect(@organization.posts.size).to eq(1)
    end
  end
end
