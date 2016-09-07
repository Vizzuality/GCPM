require 'acceptance_helper'

module Api::V1
  describe 'Projects', type: :request do
    context 'For projects' do
      let!(:organization) { FactoryGirl.create(:organization, name: 'Test orga 1', address_ids: [address.id])  }
      let!(:address)      { FactoryGirl.create(:address, country_id: country.id, line_1: 'Paris, France')      }
      let!(:investigator) { FactoryGirl.create(:investigator, name: 'Investigator', address_ids: [address.id]) }
      let!(:user)         { FactoryGirl.create(:user, authentication_token: '7Nw1A13xrHrZDHj631MA')            }
      let!(:country)      { FactoryGirl.create(:country)                                                       }
      let!(:project)      { FactoryGirl.create(:project, title: 'Project title', user_id: user.id)             }
      let(:r_u_id)        { investigator.research_units.first.id                                               }
      let!(:membership)   { Membership.create(project_id: project.id, research_unit_id: r_u_id)                }

      let(:project_id) { project.id }
      let(:params)     { { "project": { "title": "Project updated" } } }

      context 'Update Project' do
        it 'Allows to update project' do
          put "/api/projects/#{project_id}?token=#{user.authentication_token}", params: params

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
            post "/api/projects/#{project_id}/memberships/#{membership.id}?token=#{user.authentication_token}", params: { "membership": {
                                                                                                                          "membership_type": "main"
                                                                                                                        }}

            expect(status).to eq(200)
            expect(json['message']).to                  eq('Membership updated!')
            expect(Membership.first.membership_type).to eq('main')
          end

          it 'Allows to create projects memberships' do
            post "/api/projects/#{project_id}/memberships?token=#{user.authentication_token}", params: params_membership

            expect(status).to eq(201)
            expect(json['message']).to  eq('Membership created!')
            expect(Membership.count).to eq(2)
          end

          it 'Allows to delete projects memberships' do
            delete "/api/projects/#{project_id}/memberships/#{membership.id}?token=#{user.authentication_token}"

            expect(status).to eq(200)
            expect(json['message']).to  eq('Membership deleted')
            expect(Membership.count).to eq(0)
          end
        end
      end

      context 'Create Project' do
        let(:funder)        { FactoryGirl.create(:organization, name: 'Project funder', address_ids: [address.id]) }
        let(:cancer_type)   { FactoryGirl.create(:cancer_type)                                                     }
        let(:project_type)  { FactoryGirl.create(:project_type)                                                    }

        let(:create_params) { { "project": { "title": "Project updated", "summary": "Lorem ipsum..." } } }

        let(:create_full_params) { { "project": {
                                     "title": "Project updated",
                                     "summary": "Lorem ipsum...",
                                     "project_website": "www.project.com",
                                     "start_date": Time.now,
                                     "end_date": Time.now + 1.days,
                                     "status": "published",
                                     "funding_source_ids": ["#{funder.id}"],
                                     "project_type_ids": ["#{project_type.id}"],
                                     "cancer_type_ids": ["#{cancer_type.id}"],
                                     "new_funders": [{ "name": "Second project funder", "address_ids": [address.id] }]
                                   }
                                 } }

        let(:create_params_without_f_s_ids) { { "project": {
                                                "title": "Project updated",
                                                "summary": "Lorem ipsum...",
                                                "new_funders": [{ "name": "Second project funder", "address_ids": [address.id] }]
                                              }
                                            } }

        it 'Allows to create project without relations' do
          post "/api/projects?token=#{user.authentication_token}", params: create_params

          expect(status).to eq(201)
          expect(json['title']).to                                  eq('Project updated')
          expect(json['id']).to                                     be_present
          expect(json['cancer_types']).not_to                       be_present
          expect(json['project_types']).not_to                      be_present
          expect(json['funding_sources']).not_to                    be_present
          expect(Project.find_by(title: 'Project updated').user).to be_present
        end

        it 'Allows to create project with funder' do
          post "/api/projects?token=#{user.authentication_token}", params: create_full_params

          expect(status).to eq(201)
          expect(json['title']).to                                  eq('Project updated')
          expect(json['id']).to                                     be_present
          expect(json['cancer_types']).to                           be_present
          expect(json['project_types']).to                          be_present
          expect(json['funding_sources'].length).to                 eq(2)
          expect(Project.find_by(title: 'Project updated').user).to be_present
        end

        it 'Allows to create project with funder' do
          post "/api/projects?token=#{user.authentication_token}", params: create_params_without_f_s_ids

          expect(status).to eq(201)
          expect(json['funding_sources'].length).to eq(1)
        end

        it 'Do not allows to create project without title and subtitle' do
          post "/api/projects?token=#{user.authentication_token}", params: params

          expect(status).to eq(422)
          expect(json['message']).to eq(["Summary can't be blank"])
        end
      end

      context 'Project relations lists' do
        it 'Check research_unit' do
          get "/api/check_research_unit?token=#{user.authentication_token}&investigator_id=#{investigator.id}&address_id=#{address.id}"

          expect(status).to eq(200)
          expect(json['research_unit_id']).to eq (r_u_id)
        end

        it 'Get project memberships' do
          get "/api/projects/#{project_id}/memberships?token=#{user.authentication_token}"

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