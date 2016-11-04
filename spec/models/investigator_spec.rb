# == Schema Information
#
# Table name: investigators
#
#  id          :integer          not null, primary key
#  name        :string
#  email       :string
#  website     :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :integer
#  is_approved :boolean          default(FALSE)
#

require 'rails_helper'

RSpec.describe Investigator, type: :model do
  before :each do
    @user           = create(:user)
    @investigator_1 = create(:investigator, name: 'First investigator', user: @user)
    @investigator_2 = create(:investigator, name: 'Second investigator')
  end

  it 'Project user relations size' do
    expect(Investigator.all.size).to eq(2)
  end

  context "Valid investigator" do
    it 'Slug presentation' do
      expect(@investigator_1.slug).to be_present
      expect(@investigator_1.slug).to eq('first-investigator')
    end
  end

  context 'For approvable methods' do
    let(:approvable_1) { @investigator_1 }
    let(:approvable_2) {
      @investigator_1.update(is_approved: true)
      @user.investigator
    }

    it 'Approve investigator user relations' do
      approvable_1.approve
      expect(approvable_1.approved?).to            be(true)
      expect(approvable_1.approved_status).to      match('approved')
      expect(Investigator.filter_approved.size).to be(1)
    end

    it 'Unapprove investigator user relations' do
      expect(Investigator.all.size).to eq(2)

      approvable_2.unapprove
      expect(approvable_2.approved_status).to        match('unapproved')
      expect(approvable_2.unapproved?).to            be(true)
      expect(Investigator.filter_unapproved.size).to eq(1)
    end
  end
end
