require 'acceptance_helper'

module Api::V1
  describe 'Projects', type: :request do
    context 'For projects list' do
      let!(:organization) { FactoryGirl.create(:organization, name: 'Test orga 1', address_ids: [address.id])  }
      let!(:address)      { FactoryGirl.create(:address, country_id: country.id, line_1: 'Paris, France')      }
      let!(:investigator) { FactoryGirl.create(:investigator, name: 'Investigator', address_ids: [address.id]) }
      let!(:user)         { FactoryGirl.create(:user, authentication_token: '7Nw1A13xrHrZDHj631MA')            }
      let!(:country)      { FactoryGirl.create(:country)                                                       }
      let!(:project)      { FactoryGirl.create(:project, title: 'Project title', user_id: user.id)             }
      let(:r_u_id)        { investigator.research_units.first.id                                               }
      let!(:membership)   { Membership.create(project_id: project.id, research_unit_id: r_u_id)                }

      let(:project_id)        { project.id }

      let(:params)            { { "project": {
                                    "title": "Project updated"
                                  }
                              } }

      it 'Allows to update project' do
        put "/api/projects/#{project_id}?token=7Nw1A13xrHrZDHj631MA", params: params

        expect(status).to eq(200)
        expect(json['title']).to eq('Project updated')
        expect(json['id']).to    be_present
      end

      context 'For project memberships' do
        let(:params_membership) { { "membership": {
                                      "research_unit_id": "#{r_u_id}",
                                      "project_id": "project_id",
                                      "membership_type": "main"
                                    }
                                } }

        it 'Allows to update projects memberships' do
          post "/api/projects/#{project_id}/memberships/#{membership.id}?token=7Nw1A13xrHrZDHj631MA", params: {"membership": {
                                                                                                                 "membership_type": "main"
                                                                                                               }}

          expect(status).to eq(200)
          expect(json['message']).to                  eq('Membership updated!')
          expect(Membership.first.membership_type).to eq('main')
        end

        it 'Allows to create projects memberships' do
          post "/api/projects/#{project_id}/memberships?token=7Nw1A13xrHrZDHj631MA", params: params_membership

          expect(status).to eq(201)
          expect(json['message']).to  eq('Membership created!')
          expect(Membership.count).to eq(2)
        end

        it 'Allows to delete projects memberships' do
          delete "/api/projects/#{project_id}/memberships/#{membership.id}?token=7Nw1A13xrHrZDHj631MA"

          expect(status).to eq(200)
          expect(json['message']).to  eq('Membership deleted')
          expect(Membership.count).to eq(0)
        end

        it 'Check research_unit' do
          get "/api/check_research_unit?token=7Nw1A13xrHrZDHj631MA&investigator_id=#{investigator.id}&address_id=#{address.id}"

          expect(status).to eq(200)
          expect(json['research_unit_id']).to eq (r_u_id)
        end

        it 'Get project memberships' do
          get "/api/projects/#{project_id}/memberships?token=7Nw1A13xrHrZDHj631MA"

          expect(status).to eq(200)
          expect(json[0]['membership_type']).to      eq ('secondary')
          expect(json[0]['investigator']['name']).to eq ('Investigator')
          expect(json[0]['organization']['name']).to eq ('Test orga 1')
          expect(json[0]['address']['line_1']).to    eq ('Paris, France')
        end
      end
    end
  end
end