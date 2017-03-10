require 'acceptance_helper'

module Api::V1
  describe 'Investigators', type: :request do
    context 'For investigators list' do
      let!(:user)           { FactoryGirl.create(:user, authentication_token: '7Nw1A13xrHrZDHj631MA')                          }
      let!(:user_2)         { FactoryGirl.create(:user, authentication_token: '7Nw1A13xrHrZDHj631MB')                          }
      let!(:country)        { FactoryGirl.create(:country)                                                                     }
      let!(:organization)   { FactoryGirl.create(:organization, name: 'Test orga 3', address_ids: [address.id])                }
      let!(:address)        { FactoryGirl.create(:address, country_id: country.id)                                             }
      let!(:investigator)   { FactoryGirl.create(:investigator, address_ids: [address.id])                                     }
      let!(:investigator_2) { FactoryGirl.create(:investigator, name: 'Investigator 2', address_ids: [address.id], user: user) }

      let(:params) {{"investigator": { "name": "Test investigator User", "email": "testuser@sample.com", "website": "http://www.testwebsite.com", "address_ids": ["#{address.id}"],
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

      let(:params_with_user) {{"investigator": { "name": "Test investigator with User", "email": "testuser@sample.com",
                                                 "assign_to_user": true, "address_ids": ["#{address.id}"] }
                             }}

      let(:investigator_id)   { investigator.id   }
      let(:investigator_slug) { investigator.slug }
      let(:investigator_2_id) { investigator_2.id }

      it 'Allows to access investigators list' do
        get "/api/investigators?token=#{user.authentication_token}"

        investigator = json[0]
        expect(status).to               eq(200)
        expect(json.length).to          eq(2)
        expect(investigator['name']).to be_present
        expect(investigator['id']).to   be_present
      end

      it 'Do not show investigators without active projects' do
        get "/api/investigators?getall=false&token=#{user.authentication_token}"

        expect(status).to      eq(200)
        expect(json.length).to eq(0)
      end

      it 'Allows to search investigators by name' do
        get "/api/investigators?q=2"

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

      it 'Allows to access investigator by slug' do
        get "/api/investigators/#{investigator_slug}?token=#{user.authentication_token}"

        expect(status).to eq(200)
        expect(json['organizations'].size).to eq(1)
        expect(json['addresses'].size).to     eq(1)
      end

      context 'Manage investigators without user' do
        it 'Create investigator with non existing and existing origanizations' do
          post "/api/investigators?token=#{user.authentication_token}", params: params

          expect(status).to eq(201)
          expect(json['id']).to                         be_present
          expect(json['user_id']).to                    be_nil
          expect(json['organizations'].size).to         eq(3)
          expect(json['organizations'][0]['name']).to   eq('Test orga 3')
          expect(json['addresses'][0]['country_id']).to eq(country.id)
          expect(json['addresses'].size).to             eq(3)
          expect(json['organizations'][1]['name']).to   eq('Test orga 1')
          expect(json['organizations'][2]['name']).to   eq('Test orga 2')
        end

        it 'Do not allow to update investigator for not owner' do
          put "/api/investigators/#{investigator_id}?token=#{user.authentication_token}", params: params

          expect(status).to eq(422)
          expect(json['message']).to eq("Permission denied!")
        end
      end

      context 'Manage investigator with user relations' do
        it 'Create investigator with option assign to user' do
          post "/api/investigators?token=#{user_2.authentication_token}", params: params_with_user
          expect(status).to eq(201)
          expect(json['id']).to                         be_present
          expect(json['user_id']).to                    be_present
          expect(json['organizations'].size).to         eq(1)
          expect(json['addresses'][0]['country_id']).to eq(country.id)
          expect(json['addresses'].size).to             eq(1)
        end

        it 'Do not allow to create second investigator for user' do
          post "/api/investigators?token=#{user.authentication_token}", params: params_with_user
          expect(status).to eq(422)
          expect(json['message']).to eq('User has already been taken')
        end

        it 'Allow user to update owns investigator' do
          put "/api/investigators/#{investigator_2_id}?token=#{user.authentication_token}", params: params
          expect(status).to eq(200)
          expect(json['user_id']).to be_present
          expect(json['name']).to    eq('Test investigator User')
        end
      end
    end
  end
end
