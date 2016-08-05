require 'acceptance_helper'

module Api::V1
  describe 'Investigators', type: :request do
    context 'For investigators list' do
      let!(:investigators) { FactoryGirl.create(:investigator) }
      let!(:user) {
        user = FactoryGirl.create(:user, authentication_token: '7Nw1A13xrHrZDHj631MA')
        user
      }
      let!(:country)      { FactoryGirl.create(:country) }
      let!(:organization) { FactoryGirl.create(:organization, name: 'Test orga 3', address_ids: [address.id]) }
      let!(:address)      { FactoryGirl.create(:address, country_id: country.id) }

      let(:params) {{"investigator": { "name": "Test investigator", "address_ids": ["#{address.id}"],
                                       "addresses_attributes": [
                                         {"country_id": "#{country.id}", "organization_attributes": {"name": "Test orga 1"} },
                                         {"country_id": "#{country.id}", "organization_attributes": {"name": "Test orga 2"} }
                                       ]
                   }}}

      it 'Allows to access investigators list' do
        get '/api/investigators?token=7Nw1A13xrHrZDHj631MA'

        investigator = json[0]
        expect(status).to               eq(200)
        expect(json.length).to          eq(1)
        expect(investigator['name']).to be_present
        expect(investigator['id']).to   be_present
      end

      context 'Allows to manage investigators' do
        it 'Create investigator with non existing and existing origanizations' do
          post '/api/investigators?token=7Nw1A13xrHrZDHj631MA', params: params

          expect(status).to eq(201)
          expect(json['id']).to                         be_present
          expect(json['organizations'].size).to         eq(3)
          expect(json['organizations'][0]['name']).to   eq('Test orga 3')
          expect(json['addresses'][0]['country_id']).to eq(country.id)
          expect(json['addresses'].size).to             eq(3)
          expect(json['organizations'][1]['name']).to   eq('Test orga 1')
        end
      end
    end
  end
end