# == Schema Information
#
# Table name: specialities
#
#  id         :integer          not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  slug       :string
#

require 'rails_helper'

RSpec.describe Speciality, type: :model do
  before :each do
    @speciality = create(:speciality, name: 'Test speciality')
  end

  context "Valid speciality" do
    it 'Slug presentation' do
      expect(@speciality).to      be_valid
      expect(@speciality.slug).to be_present
      expect(@speciality.slug).to eq('test-speciality')
    end
  end

  context 'For post relations' do
    before :each do
      @post         = create(:post, user: @user)
      @project      = create(:project, project_types: [create(:project_type, name: "project type 1")],
                                       cancer_types: [create(:cancer_type, name: "cancer type 1")],
                                       specialities: [create(:speciality, name: "speciality 1")])
      @organization = create(:organization)
      @speciality   = create(:speciality)
      create(:pin, pinable: @project,      post: @post)
      create(:pin, pinable: @organization, post: @post)
      create(:pin, pinable: @speciality,   post: @post)
    end

    it 'Pins count' do
      expect(@project.pins.size).to     eq(1)
      expect(@speciality.posts.size).to eq(1)
    end
  end
end
