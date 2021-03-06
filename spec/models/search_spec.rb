# == Schema Information
#
# Table name: searches
#
#  searchable_id   :integer
#  searchable_type :text
#  term            :string
#

require 'rails_helper'

RSpec.describe Search, type: :model do
  before :each do
    @user = create(:user)
    create(:project,      title: 'breast cancer project',   status: 1, users: [@user], project_types: [create(:project_type, name: "project type 1")],
                                                                                          cancer_types: [create(:cancer_type, name: "cancer type 1")])
    create(:project,      title: 'breast cancer project 2', status: 0, users: [@user], project_types: [create(:project_type, name: "project type 2")],
                                                                                          cancer_types: [create(:cancer_type, name: "cancer type 2")])
    create(:cancer_type,  name:  'breast cancer')
    create(:investigator, name:  'breast investigator', user: @user)
    create(:event,        title: 'breast event',        user: @user)
    create(:organization, name:  'breast orga')
    create(:user,         name:  'Tytus Roble Doble')
    create(:project,      title: 'Vanderbilt-Emory-Cornell-Duke Consortium for Global Health Fellows (VECDor)', status: 1, users: [@user], project_types: [create(:project_type, name: "project type 3")],
                          cancer_types: [create(:cancer_type, name: "cancer type 3")])

    @term   = 'breast'
    @term_2 = 'Breast cancer'
    @term_3 = "Roble"
    @term_4 = "Vanderbilt-Emory-Cornell-Duke Consortium for Global Health Fellows (VECDor)"
    @type_1 = 'Investigator'
    @type_2 = 'CancerType'
    @type_3 = 'project'
    @type_4 = 'event'
    @type_5 = 'organization'
    @type_6 = 'user'
  end

  it 'Search indexed items count' do
    # Search in projects and organizations, users in two columns
    expect(Search.all.count).to eq(16)
  end

  it 'Search count' do
    search = Search.new(@term)
    expect(search.results.count).to eq(5)
  end

  it 'Search for specific string' do
    search = Search.new(@term_2)
    expect(search.results.count).to eq(2)
  end

  it 'Search for special string' do
    search = Search.new(@term_4)
    expect(search.results.count).to eq(1)
  end

  context "Search by types" do
    it 'By project' do
      search = Search.new(@term, @type_3)
      expect(search.results.count).to eq(1)
    end

    it 'By investigator' do
      search = Search.new(@term, @type_1)
      expect(search.results.count).to eq(1)
    end

    it 'By cancer type' do
      search = Search.new(@term, @type_2)
      expect(search.results.count).to eq(1)
    end

    it 'By event' do
      search = Search.new(@term, @type_4)
      expect(search.results.count).to eq(1)
    end

    it 'By organization' do
      search = Search.new(@term, @type_5)
      expect(search.results.count).to eq(1)
    end

    it 'By user' do
      search = Search.new(@term_3, @type_6)
      expect(search.results.count).to eq(1)
    end
  end
end
