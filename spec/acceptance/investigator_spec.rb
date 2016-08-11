require 'acceptance_helper'

module Api::V1
  describe 'Investigators', type: :request do
    context 'For investigators list' do
      let!(:user)         { FactoryGirl.create(:user, authentication_token: '7Nw1A13xrHrZDHj631MA')           }
      let!(:country)      { FactoryGirl.create(:country)                                                      }
      let!(:organization) { FactoryGirl.create(:organization, name: 'Test orga 3', address_ids: [address.id]) }
      let!(:address)      { FactoryGirl.create(:address, country_id: country.id)                              }
      let!(:investigator) { FactoryGirl.create(:investigator, address_ids: [address.id])                      }

      let(:params) {{"investigator": { "name": "Test investigator", "email": "testuser@sample.com", "website": "http://www.testwebsite.com", "address_ids": ["#{address.id}"],
                                       "addresses_attributes": [
                                         {"country_id": "#{country.id}",
                                          "city": "",
                                          "latitude": "",
                                          "longitude": "",
                                          "line_1": "",
                                          "line_2": "",
                                          "line_3": "",
                                          "postcode": "",
                                          "primary": "",
                                          "state": "",
                                          "state_code": "",
                                          "geonames_city_id": "",
                                          "organization_attributes": {"name": "Test orga 1",
                                                                      "acronym": "",
                                                                      "grid_id": "",
                                                                      "email_address": "",
                                                                      "established": "",
                                                                      "organization_type_id": ""}},
                                         {"country_id": "#{country.id}", "organization_attributes": {"name": "Test orga 2"}}
                                       ]
                   }}}

      let(:investigator_id) { investigator.id }

      it 'Allows to access investigators list' do
        get "/api/investigators?token=#{user.authentication_token}"

        investigator = json[0]
        expect(status).to               eq(200)
        expect(json.length).to          eq(1)
        expect(investigator['name']).to be_present
        expect(investigator['id']).to   be_present
      end

      it 'Allows to access investigator by id' do
        get "/api/investigators/#{investigator_id}?token=#{user.authentication_token}"

        expect(status).to eq(200)
        expect(json['organizations'].size).to eq(1)
        expect(json['addresses'].size).to     eq(1)
      end

      context 'Allows to manage investigators' do
        it 'Create investigator with non existing and existing origanizations' do
          post "/api/investigators?token=#{user.authentication_token}", params: params

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
