require 'rails_helper'

RSpec.describe NetworkProjectsController, type: :controller do
  before :each do
    @user       = create(:user)
    @user_first = create(:user)
    @adminuser  = create(:admin_user)
    @project_2  = create(:project, title: 'Second project', users: [@user])
  end

  let!(:approve_relation) {
    ProjectUser.find_by(user_id: @user.id, project_id: @project_2.id).update(is_approved: true)
  }

  context 'For authenticated user' do
    before :each do
      @project_1 = create(:project, title: 'First project', users: [@user_first, @user])
      @project_3 = create(:project, title: 'Third project', users: [@user], created_by: @user.id)
      sign_in @user
    end

    let!(:build_params) do
      { title: 'Created project', summary: 'Lorem ipsum...' }
    end

    it 'Alows user to access new project page' do
      process :new, method: :get, params: { user_id: @user.id }
      expect(response).to be_success
      expect(response).to have_http_status(200)
    end

    it 'Allows user to update owned project' do
      process :update, method: :patch, params: { user_id: @user.id, id: @project_2.id, project: { id: @project_2.id, title: 'Updated project' } }
      expect(response).to be_redirect
      expect(response).to have_http_status(302)
      expect(@project_2.reload.title).to eq('Updated project')
    end

    it 'Allows user to update owned project if relation not approved and user is unique owner' do
      process :update, method: :patch, params: { user_id: @user.id, id: @project_3.id, project: { id: @project_3.id, title: 'Updated project' } }
      expect(response).to be_redirect
      expect(response).to have_http_status(302)
      expect(@project_3.reload.title).to eq('Updated project')
    end

    it 'Do not allows user to update owned project if relation not approved and user is not creator of project' do
      process :update, method: :patch, params: { user_id: @user.id, id: @project_1.id, project: { id: @project_1.id, title: 'Updated project' } }
      expect(response).to be_redirect
      expect(response).to have_http_status(302)
      expect(@project_1.reload.title).to eq('First project')
    end
  end

  context 'For authenticated adminuser' do
    before :each do
      sign_in @adminuser
    end

    it 'Request relation with project' do
      process :update, method: :patch, params: { user_id: @user.id, id: @project_2.id, project: { id: @project_2.id, title: 'Updated project' } }
      expect(response).to be_redirect
      expect(response).to have_http_status(302)
      expect(@project_2.reload.title).to eq('Updated project')
    end
  end
end
