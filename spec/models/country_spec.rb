# == Schema Information
#
# Table name: countries
#
#  id               :integer          not null, primary key
#  country_name     :string
#  region_name      :string
#  country_iso      :string
#  region_iso       :string
#  country_centroid :string
#  region_centroid  :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  country_iso_3    :string
#

require 'rails_helper'

RSpec.describe Country, type: :model do
  context 'For post relations' do
    before :each do
      @post         = create(:post, user: @user)
      @project      = create(:project)
      @organization = create(:organization)
      @cancer_type  = create(:cancer_type)
      @country      = create(:country)
      create(:pin, pinable: @project, post: @post)
      create(:pin, pinable: @organization, post: @post)
      create(:pin, pinable: @cancer_type, post: @post)
      create(:pin, pinable: @country, post: @post)
    end

    it 'Pins count' do
      expect(@project.pins.size).to  eq(1)
      expect(@country.posts.size).to eq(1)
    end
  end
end
