require 'acceptance_helper'

module Api::V1
  describe 'Projects', type: :request do
    context 'For projects list' do
      let!(:projects) { FactoryGirl.create(:project) }
      let!(:user) {
        user = FactoryGirl.create(:user, authentication_token: '7Nw1A13xrHrZDHj631MA')
        user
      }

      # it 'Allows to access projects list' do
      #   get '/api/projects?token=7Nw1A13xrHrZDHj631MA'

      #   project = json[0]
      #   expect(status).to eq(200)
      #   expect(json.length).to eq(1)
      #   expect(project['name']).to be_present
      #   expect(project['id']).to be_present
      # end
    end
  end
end