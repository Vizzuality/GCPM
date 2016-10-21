require 'rails_helper'

RSpec.describe InvestigatorsController, type: :controller do
  before :each do
    @user           = create(:user)
    @investigator_2 = create(:investigator, name: 'Second investigator')
  end

  it 'GET edit returns http success' do
    process :show, params: { id: @investigator_2.id }
    expect(response).to be_success
    expect(response).to have_http_status(200)
  end

  context 'For authenticated user' do
    before :each do
      @investigator_1 = create(:investigator, name: 'First investigator', user: @user)
      sign_in @user
    end

    it 'Delete relation with investigator' do
      process :remove_relation, method: :patch, params: { id: @investigator_1.id }
      expect(response).to be_redirect
      expect(response).to have_http_status(302)
      expect(Investigator.find_by(user_id: @user.id)).to be_nil
    end

    it 'Do not allow to request relation with investigator if any user investigator exist' do
      process :relation_request, method: :patch, params: { id: @investigator_2.id }
      expect(response).to be_redirect
      expect(response).to have_http_status(302)
      expect(Investigator.find(@investigator_2.id).user_id).to be_nil
    end
  end

  context 'User should be able to request investigator relation' do
    before :each do
      sign_in @user
    end

    it 'Request relation with investigator' do
      process :relation_request, method: :patch, params: { id: @investigator_2.id }
      expect(response).to be_redirect
      expect(response).to have_http_status(302)
      expect(Investigator.find(@investigator_2.id).user.id).to be_present
    end
  end
end
