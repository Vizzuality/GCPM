require 'rails_helper'

RSpec.describe ProjectsController, type: :controller do
  before :each do
    @user      = create(:user)
    @project_2 = create(:project, title: 'Second project', project_types: [create(:project_type, name: "project type 1")],
                                                           cancer_types: [create(:cancer_type, name: "cancer type 1")], status: 'published')
  end

  it 'GET edit returns http success' do
    process :show, params: { id: @project_2.id }
    expect(response).to be_success
    expect(response).to have_http_status(200)
  end

  context 'For not published projects' do
    before :each do
      @project_4 = create(:project, title: 'Not published project', project_types: [create(:project_type, name: "project type 3")],
                                                                    cancer_types: [create(:cancer_type, name: "cancer type 3")])
    end

    it 'Request not published project return to root url' do
      process :show, params: { id: @project_4.id }
      expect(response).to be_redirect
      expect(response).to have_http_status(302)
      expect(response).to redirect_to(root_path)
    end
  end

  context 'For authenticated user' do
    before :each do
      @project_1 = create(:project, title: 'First project', users: [@user], project_types: [create(:project_type, name: "project type 2")],
                                                            cancer_types: [create(:cancer_type, name: "cancer type 2")])
      sign_in @user
    end

    it 'Delete relation with project' do
      process :remove_relation, method: :patch, params: { id: @project_1.id }
      expect(response).to be_redirect
      expect(response).to have_http_status(302)
      expect(@user.projects.size).to be(0)
    end

    it 'Request relation with project' do
      process :relation_request, method: :patch, params: { id: @project_2.id }
      expect(response).to be_redirect
      expect(response).to have_http_status(302)
      expect(@user.projects.size).to be(2)
    end
  end
end
