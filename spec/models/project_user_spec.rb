# == Schema Information
#
# Table name: project_users
#
#  id          :integer          not null, primary key
#  project_id  :integer
#  user_id     :integer
#  is_approved :boolean          default(FALSE)
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

require 'rails_helper'

RSpec.describe ProjectUser, type: :model do
  before :each do
    @user      = create(:user)
    @project_1 = create(:project, title: 'First project',  users: [@user], status: 1)
    @project_2 = create(:project, title: 'Second project', users: [@user], status: 1)
  end

  it 'Project user relations size' do
    expect(ProjectUser.all.size).to eq(2)
  end

  context 'For approvable methods' do
    let!(:approvable_1) { @user.project_users.find_by(project_id: @project_1.id) }
    let!(:approvable_2) {
      ProjectUser.where(project_id: @project_2.id).update(is_approved: true)
      @user.project_users.find_by(project_id: @project_2.id)
    }

    it 'Approve project user relations' do
      approvable_1.approve
      expect(approvable_1.approved?).to           be(true)
      expect(approvable_1.approved_status).to     match('approved')
      expect(ProjectUser.filter_approved.size).to be(2)
    end

    it 'Unapprove project user relations' do
      approvable_2.unapprove
      expect(approvable_2.approved_status).to       match('unapproved')
      expect(approvable_2.unapproved?).to           be(true)
      expect(ProjectUser.filter_unapproved.size).to eq(2)
    end
  end
end
