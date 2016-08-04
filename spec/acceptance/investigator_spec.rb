require 'acceptance_helper'

module Api::V1
  describe 'Investigators', type: :request do
    context 'For investigators list' do
      let!(:investigators) { FactoryGirl.create(:investigator) }
      let!(:user) {
        user = FactoryGirl.create(:user, authentication_token: '7Nw1A13xrHrZDHj631MA')
        user
      }
      let!(:country) { FactoryGirl.create(:country, id: 21) }

      let(:params) {
        {"investigator": {"name": "Test investigator", "addresses_attributes": [{"country_id": "21", "organization_attributes": {"name": "Test orga"}}] } }
      }

      it 'Allows to access investigators list' do
        get '/api/investigators?token=7Nw1A13xrHrZDHj631MA'

        investigator = json[0]
        expect(status).to               eq(200)
        expect(json.length).to          eq(1)
        expect(investigator['name']).to be_present
        expect(investigator['id']).to   be_present
      end

      it 'Allows to manage investigators' do
        post '/api/investigators?token=7Nw1A13xrHrZDHj631MA', params: params

        expect(status).to eq(201)
        expect(json['id']).to                         be_present
        expect(json['organizations'][0]['name']).to   eq('Test orga')
        expect(json['addresses'][0]['country_id']).to eq(21)
      end
    end
  end
end