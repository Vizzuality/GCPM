require 'acceptance_helper'

module Api::V1
  describe 'Investigators', type: :request do
    context 'For organizations list' do
      let!(:user)         { FactoryGirl.create(:user, authentication_token: '7Nw1A13xrHrZDHj631MA')           }
      let!(:country)      { FactoryGirl.create(:country)                                                      }
      let!(:organization) { FactoryGirl.create(:organization, name: 'Test orga 3', address_ids: [address.id]) }
      let!(:address)      { FactoryGirl.create(:address, country_id: country.id)                              }

      let(:organization_id) { organization.id }

      it 'Allows to access organizations list' do
        get "/api/organizations?token=#{user.authentication_token}"

        organization = json[0]
        expect(status).to               eq(200)
        expect(json.length).to          eq(1)
        expect(organization['name']).to be_present
        expect(organization['id']).to   be_present
      end

      it 'Allows to access organization by id' do
        get "/api/organizations/#{organization_id}?token=#{user.authentication_token}"

        expect(status).to eq(200)
        expect(json['addresses'].size).to eq(1)
      end

      it 'Allows to access countries list' do
        get "/api/countries?token=#{user.authentication_token}"

        country = json[0]
        expect(status).to          eq(200)
        expect(json.length).to     eq(1)
        expect(country['name']).to be_present
        expect(country['id']).to   be_present
      end
    end
  end
end
