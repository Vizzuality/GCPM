require 'rails_helper'

RSpec.describe SearchController, type: :controller do
  before :each do
    create(:cancer_type,  name: 'Breast')
    create(:project,      title: 'Breast project', status: 'published')
    create(:project,      title: 'Breast project 2')
    create(:organization, name: 'Breast orga')
  end

  it 'GET index returns http success' do
    get :index
    expect(response).to be_success
    expect(response).to have_http_status(200)
  end

  context 'For searches' do
    render_views

    it 'Search for all option' do
      get :index, params: { search: { item: 'breast', type: 'All sections' } }
      expect(response).to be_success
      expect(response).to have_http_status(200)
      expect(response.body).to match('(3)')
    end

    it 'Search in projects results only for projects with status published' do
      get :index, params: { search: { item: 'breast', type: 'CancerType' } }
      expect(response).to be_success
      expect(response).to have_http_status(200)
      expect(response.body).to match('(1)')
    end

    it 'Search in organizations' do
      get :index, params: { search: { item: 'breast', type: 'Organization' } }
      expect(response).to be_success
      expect(response).to have_http_status(200)
      expect(response.body).to match('(1)')
    end
  end
end
