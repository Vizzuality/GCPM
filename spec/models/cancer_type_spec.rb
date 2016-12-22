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

  context 'For post relations' do
    before :each do
      @post         = create(:post, user: @user)
      @project      = create(:project, project_types: [create(:project_type, name: "project type 1")],
                                       cancer_types: [create(:cancer_type, name: "cancer type 1")])
      @organization = create(:organization)
      @cancer_type  = create(:cancer_type)
      create(:pin, pinable: @project, post: @post)
      create(:pin, pinable: @organization, post: @post)
      create(:pin, pinable: @cancer_type, post: @post)
    end

    it 'Pins count' do
      expect(@project.pins.size).to  eq(1)
      expect(@cancer_type.posts.size).to eq(1)
    end
  end
end
