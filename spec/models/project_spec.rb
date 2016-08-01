# == Schema Information
#
# Table name: projects
#
#  id              :integer          not null, primary key
#  title           :string
#  summary         :text
#  project_website :text
#  start_date      :date
#  end_date        :date
#  status          :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  user_id         :integer
#

require 'rails_helper'

RSpec.describe Project, type: :model do
  before :each do
    @user = create(:user)
  end

  context "Valid project" do
    before :each do
      @project = create(:project, user_id: @user.id)
    end

    it 'Projects count' do
      expect(Project.count).to eq(1)
      expect(@project.user).to be_valid
    end
  end

  context "Projects validation" do
    it 'Project title validation' do
      @project_reject = build(:project, title: '', user_id: @user.id)

      @project_reject.valid?
      expect {@project_reject.save!}.to raise_error(ActiveRecord::RecordInvalid, "Validation failed: Title can't be blank")
    end

    it 'Project summary validation' do
      @project_reject = build(:project, summary: '', user_id: @user.id)

      @project_reject.valid?
      expect {@project_reject.save!}.to raise_error(ActiveRecord::RecordInvalid, "Validation failed: Summary can't be blank")
    end

    it 'Project user validation allow optional user' do
      @project = build(:project)

      expect(@project).to      be_valid
      expect(@project.user).to be_nil
    end
  end
end
