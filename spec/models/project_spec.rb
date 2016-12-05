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
#  slug            :string
#  created_by      :integer
#

require 'rails_helper'

RSpec.describe Project, type: :model do
  before :each do
    @user = create(:user)
  end

  context "Valid project" do
    before :each do
      @project = create(:project, users: [@user])
    end

    it 'Projects count' do
      expect(Project.count).to  eq(1)
      expect(@project.users).to be_any
      expect(@project.slug).to  be_present
    end
  end

  context "Projects validation" do
    before :each do
      @cancer_type = create(:cancer_type)
      @project     = create(:project, title: 'Project one', summary: 'Lorem ipsum..', cancer_type_ids: [@cancer_type.id], status: 'published')

      create(:project, title: 'Project 2', summary: 'Lorem ipsum..', cancer_type_ids: [@cancer_type.id], status: 'published')
      create(:project, title: 'Project 3', summary: 'Lorem ipsum..', cancer_type_ids: [@cancer_type.id], status: 'published')
      create(:project, title: 'Project 4', summary: 'Lorem ipsum..', status: 'published')
    end

    it 'Project title validation' do
      @project_reject = build(:project, title: '', users: [@user])

      @project_reject.valid?
      expect {@project_reject.save!}.to raise_error(ActiveRecord::RecordInvalid, "Validation failed: Title can't be blank, Slug can't be blank")
    end

    it 'Project summary validation' do
      @project_reject = build(:project, title: 'Second project', summary: '', users: [@user])

      @project_reject.valid?
      expect {@project_reject.save!}.to raise_error(ActiveRecord::RecordInvalid, "Validation failed: Summary can't be blank")
    end

    it 'Project user validation allow optional user' do
      @project = build(:project)

      expect(@project).to       be_valid
      expect(@project.users).to be_empty
    end

    it 'Do not allow to create project with title douplications' do
      @project_reject = Project.new(title: 'Project one', summary: 'Lorem ipsum..')

      @project_reject.valid?
      expect {@project_reject.save!}.to raise_error(ActiveRecord::RecordInvalid, "Validation failed: Title has already been taken")
    end

    context 'Related projects' do
      it 'Get relataded projects by default params' do
        related_projects = @project.related
        expect(related_projects.size).to eq(2)
      end

      it 'Get relataded projects for size param' do
        related_projects = @project.related(size: 1)
        expect(related_projects.size).to eq(1)
      end
    end
  end
end
