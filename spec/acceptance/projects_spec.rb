require 'acceptance_helper'

module Api::V1
  describe 'Projects', type: :request do
    context 'For projects' do
      let!(:organization)      { FactoryGirl.create(:organization, name: 'Test orga 1', address_ids: [address.id])        }
      let!(:address)           { FactoryGirl.create(:address, country_id: country.id, line_1: 'Paris, France')            }
      let!(:address_2)         { FactoryGirl.create(:address, country_id: country.id, line_1: 'Paris, France')            }
      let!(:investigator)      { FactoryGirl.create(:investigator, name: 'Investigator', address_ids: [address.id])       }
      let!(:investigator_2)    { FactoryGirl.create(:investigator, name: 'Investigator 2', address_ids: [address.id])     }
      let!(:investigator_3)    { FactoryGirl.create(:investigator, name: 'Investigator 3')                                }
      let!(:user)              { FactoryGirl.create(:user, authentication_token: '7Nw1A13xrHrZDHj631MA')                  }
      let!(:country)           { FactoryGirl.create(:country)                                                             }
      let!(:project)           { FactoryGirl.create(:project, title: 'Project title', users: [user], status: 'published',
                                                     project_types: [create(:project_type, name: "project type 1")],
                                                     cancer_types: [create(:cancer_type, name: "cancer type 1")])         }
      let!(:project_2)         { FactoryGirl.create(:project, title: 'Project not owned', status: 'published',
                                                     project_types: [create(:project_type, name: "project type 2")],
                                                     cancer_types: [create(:cancer_type, name: "cancer type 2")])         }
      let(:r_u_id)             { investigator.research_units.first.id                                                     }
      let(:r_u_id_2)           { investigator_2.research_units.first.id                                                   }
      let!(:membership)        { Membership.create(project_id: project.id,
                                                   research_unit_id: r_u_id, membership_type: 'secondary')                }
      let(:funder)             { FactoryGirl.create(:organization, name: 'Project funder', address_ids: [address.id])     }
      let!(:cancer_type)       { FactoryGirl.create(:cancer_type)                                                         }
      let!(:project_type)      { FactoryGirl.create(:project_type)                                                        }
      let!(:organization_type) { FactoryGirl.create(:organization_type)                                                   }
      let!(:speciality)        { FactoryGirl.create(:speciality)                                                          }

      let(:project_id)   { project.id   }
      let(:project_slug) { project.slug }
      let(:project_2_id) { project_2.id }

      let(:params)     { { "project": { "title": "Project updated" } } }

      let(:full_params) { { "project": {
                            "title": "Project updated",
                            "summary": "Lorem ipsum...",
                            "project_website": "www.project.com",
                            "start_date": Time.now,
                            "end_date": Time.now + 1.days,
                            "status": "published",
                            "funding_source_ids": ["#{funder.id}"],
                            "project_type_ids": ["#{project_type.id}"],
                            "cancer_type_ids": ["#{cancer_type.id}"],
                            "speciality_ids": ["#{speciality.id}"],
                            "new_funders": [{ "name": "Test funder 1", "email_address": "", "organization_type_id": 1,
                                              "addresses_attributes": [{"country_id": "#{country.id}",
                                                                        "latitude": "",
                                                                        "longitude": "",
                                                                        "primary": true
                                                                      }] },
                                              { "name": "Test funder 2", "email_address": "", "organization_type_id": 2,
                                                "addresses_attributes": [{"country_id": "#{country.id}",
                                                                          "latitude": "",
                                                                          "longitude": "",
                                                                          "primary": false
                                                                        }] }],
                            "memberships": [{ "research_unit_attributes": { "investigator_attributes": { "name": "Test investigator NEW", "email": "testuser@sample.com", "website": "http://www.testwebsite.com", "addresses_attributes": [{ "country_id": "#{country.id}", "organization_attributes": { "name": "Test orga NEW", "organization_type_id": "#{organization_type.id}" }}]}}, "membership_type": "main" },
                                            { "research_unit_attributes": { "investigator_attributes": { "name": "Test investigator 7000000000", "email": "testuser@sample.com", "website": "http://www.testwebsite.com"}, "address_id": "#{address.id}" }, "membership_type": "secondary" },
                                            { "research_unit_attributes": { "investigator_id": "#{investigator_2.id}", "address_attributes": { "country_id": "#{country.id}", "organization_attributes": { "name": "Test orga 1000000", "organization_type_id": "#{organization_type.id}" }}}, "membership_type": "secondary" },
                                            { "research_unit_attributes": { "investigator_id": "#{investigator_3.id}", "address_id": "#{address_2.id}" }, "membership_type": "secondary" }]
                                           }
                        } }

        let(:params_without_f_s_ids) { { "project": {
                                         "title": "Project updated",
                                         "summary": "Lorem ipsum...",
                                         "start_date": Time.now,
                                         "end_date": Time.now + 1.days,
                                         "project_type_ids": ["#{project_type.id}"],
                                         "cancer_type_ids": ["#{cancer_type.id}"],
                                         "new_funders": [{ "name": "Test funder 1", "email_address": "", "organization_type_id": 1,
                                                           "addresses_attributes": [{"country_id": "#{country.id}",
                                                                                     "latitude": "",
                                                                                     "longitude": "",
                                                                                     "primary": true
                                                                                   }] }]
                                       }
                                     } }

      let(:update_params_for_membership) { { "project": {
                                             "title": "Project updated",
                                             "summary": "Lorem ipsum...",
                                             "cancer_type_ids": ["#{cancer_type.id}"],
                                             "project_type_ids": ["#{project_type.id}"],
                                             "funding_source_ids": ["#{funder.id}"],
                                             "new_funders": [{ "name": "Test funder 1", "email_address": "", "organization_type_id": 1,
                                                               "addresses_attributes": [{"country_id": "#{country.id}",
                                                                                         "latitude": "",
                                                                                         "longitude": "",
                                                                                         "primary": true
                                                                                       }] }],
                                            "memberships": [{ "research_unit_id": "#{r_u_id_2}", "membership_type": "main" }]
                                            }}}

      let(:update_memberships) { { "project": {
                                  "memberships": [{ "id": membership.id, "membership_type": "main" }]
                                  }}}

      context 'Projects' do
        it 'List projects' do
          get "/api/projects"

          expect(status).to    eq(200)
          expect(json.size).to eq(2)
        end
      end

      context 'Users projects' do
        it 'Allows to view project owned by user' do
          get "/api/projects/#{project_id}?token=#{user.authentication_token}"

          expect(status).to eq(200)
          expect(json['title']).to                             eq('Project title')
          expect(json['id']).to                                be_present
          expect(json['users'][0]['id']).to                    be(user.id)
          expect(json['memberships'][0]['membership_type']).to be_present
          expect(json['memberships'][0]['investigator']).to    be_present
          expect(json['memberships'][0]['organization']).to    be_present
          expect(json['memberships'][0]['address']).to         be_present
        end

        it 'Allow to access project without auth token for not owned project' do
          get "/api/projects/#{project_2_id}"

          expect(status).to eq(200)
        end
      end

      context 'Update Project' do
        it 'Allows to update project' do
          put "/api/projects/#{project_slug}?token=#{user.authentication_token}", params: params

          expect(status).to eq(200)
          expect(json['title']).to eq('Project updated')
          expect(json['id']).to    be_present
        end

        it 'Do not allows to update project with blank title and validate title before creating a new funder' do
          put "/api/projects/#{project_id}?token=#{user.authentication_token}", params: { "project": { "title": "",
                                                                                                       "new_funders": [
                                                                                                         { "name": "Second project funder", "address_ids": [address.id] }
                                                                                                       ] } }

          expect(status).to eq(422)
          expect(json['message']).to eq(["Title can't be blank"])
          expect(Organization.find_by(name: "Second project funder")).to be_nil
        end

        it 'Allows to update project with funding_sources_ids and new funders' do
          put "/api/projects/#{project_id}?token=#{user.authentication_token}", params: update_params_for_membership

          expect(status).to eq(200)
          expect(json['title']).to eq('Project updated')
          expect(json['id']).to                     be_present
          expect(json['cancer_types']).to           be_present
          expect(json['project_types']).to          be_present
          expect(json['funding_sources'].length).to eq(2)
          expect(json['memberships'].length).to     eq(2)
          expect(Membership.find_by(research_unit_id: r_u_id_2).project_id).to eq(json['id'])
        end

        it 'Allows to update project with funding_sources_ids and new funders' do
          patch "/api/projects/#{project_id}?token=#{user.authentication_token}", params: update_memberships

          expect(status).to eq(200)
          expect(json['memberships'].length).to                eq(1)
          expect(json['memberships'][0]['membership_type']).to eq('main')
        end

        # Memeberships
        it 'Allows to update project without existing funders and all cases for memberships' do
          patch "/api/projects/#{project_slug}?token=#{user.authentication_token}", params: full_params

          expect(status).to eq(200)
          expect(json['funding_sources'].length).to  eq(3)
          expect(json['specialities'][0]['name']).to eq('Speciality one')
          expect(Project.find(project_id).memberships.map(&:membership_type)).to eq(['secondary', 'main', 'secondary', 'secondary'])
        end

        context 'For project memberships' do
          let(:params_membership) { { "membership": {
                                      "research_unit_id": "#{r_u_id}",
                                      "project_id": "project_id",
                                      "membership_type": "main"
                                    }
                                  } }

          it 'Allows to update projects memberships' do
            post "/api/projects/#{project_slug}/memberships/#{membership.id}?token=#{user.authentication_token}", params: { "membership": {
                                                                                                                          "membership_type": "main"
                                                                                                                        }}

            expect(status).to eq(200)
            expect(json['message']).to eq('Membership updated!')
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
        let(:create_params) { { "project": { "title": "Project updated", "summary": "Lorem ipsum...",
                                             "start_date": Time.now,
                                             "end_date": Time.now + 1.days,
                                             "project_type_ids": ["#{project_type.id}"],
                                             "cancer_type_ids": ["#{cancer_type.id}"], } } }

        it 'Allows to create project without relations' do
          post "/api/projects?token=#{user.authentication_token}", params: create_params

          expect(status).to eq(201)
          expect(json['title']).to                                   eq('Project updated')
          expect(json['id']).to                                      be_present
          expect(json['cancer_types']).to                            be_present
          expect(json['project_types']).to                           be_present
          expect(json['funding_sources']).not_to                     be_present
          expect(Project.find_by(title: 'Project updated').users).to be_any
        end

        it 'Allows to create project with funder and memberships' do
          post "/api/projects?token=#{user.authentication_token}", params: full_params

          expect(status).to eq(201)
          expect(json['title']).to                                   eq('Project updated')
          expect(json['id']).to                                      be_present
          expect(json['cancer_types']).to                            be_present
          expect(json['project_types']).to                           be_present
          expect(json['funding_sources'].length).to                  eq(3)
          expect(json['memberships'].length).to                      eq(4)
          expect(Project.find_by(title: 'Project updated').users).to be_any
        end

        it 'Allows to create project with funder' do
          post "/api/projects?token=#{user.authentication_token}", params: params_without_f_s_ids

          expect(status).to eq(201)
          expect(json['funding_sources'].length).to eq(1)
        end

        it 'Do not allows to create project without title and subtitle' do
          post "/api/projects?token=#{user.authentication_token}", params: params

          expect(status).to eq(422)
          expect(json['message']).to eq(["Summary can't be blank", "Cancer types can't be blank", "Project types can't be blank"])
        end

        it 'Do not allows to create project with blank title and validate title before creating a new funder' do
          post "/api/projects?token=#{user.authentication_token}", params: { "project": { "title": "",
                                                                                          "new_funders": [
                                                                                            { "name": "Second project funder", "address_ids": [address.id] }
                                                                                          ] } }

          expect(status).to eq(422)
          expect(json['message']).to eq(["Title can't be blank", "Summary can't be blank", "Cancer types can't be blank", "Project types can't be blank", "Slug can't be blank"])
          expect(Organization.find_by(name: "Second project funder")).to be_nil
        end
      end

      context 'Project relations lists' do
        it 'Check research_unit' do
          get "/api/check_research_unit?token=#{user.authentication_token}&investigator_id=#{investigator.id}&address_id=#{address.id}"

          expect(status).to eq(200)
          expect(json['research_unit_id']).to eq (r_u_id)
        end

        it 'Get project memberships' do
          get "/api/projects/#{project_slug}/memberships?token=#{user.authentication_token}"

          expect(status).to eq(200)
          expect(json[0]['membership_type']).to      eq ('secondary')
          expect(json[0]['investigator']['name']).to eq ('Investigator')
          expect(json[0]['organization']['name']).to eq ('Test orga 1')
          expect(json[0]['address']['line_1']).to    eq ('Paris, France')
        end

        it 'Get project-types list' do
          get "/api/projects/#{project_id}/memberships?token=#{user.authentication_token}"

          expect(status).to eq(200)
          expect(json[0]['membership_type']).to      eq ('secondary')
          expect(json[0]['investigator']['name']).to eq ('Investigator')
          expect(json[0]['organization']['name']).to eq ('Test orga 1')
          expect(json[0]['address']['line_1']).to    eq ('Paris, France')
        end

        it 'Get project-types list' do
          get "/api/project-types"

          expect(status).to eq(200)
          expect(json.length).to eq (3)
        end

        it 'Get project-types list' do
          get "/api/cancer-types"

          expect(status).to eq(200)
          expect(json.length).to eq (3)
        end

        it 'Get funding-sources list' do
          get "/api/funding-sources"

          expect(status).to eq(200)
          expect(json.length).to eq (1)
        end

        it 'Get organization-types list' do
          get "/api/organization-types"

          expect(status).to eq(200)
          expect(json.length).to eq (1)
        end

        it 'Get countries list' do
          get "/api/countries"

          expect(status).to eq(200)
          expect(json.length).to eq (1)
          expect(json[0]['name']).to eq ('Andorra')
        end
      end
    end
  end
end
