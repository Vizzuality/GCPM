# == Schema Information
#
# Table name: posts
#
#  id         :integer          not null, primary key
#  title      :string
#  body       :text
#  user_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'rails_helper'

RSpec.describe Post, type: :model do
  before :each do
    @post         = create(:post, user: @user)
    @project      = create(:project, project_types: [create(:project_type, name: "project type 1")],
                                     cancer_types: [create(:cancer_type, name: "cancer type 1")])
    @organization = create(:organization)
    create(:pin, pinable: @project, post: @post)
    create(:pin, pinable: @organization, post: @post)
  end

  it 'Pins count' do
    expect(Pin.count).to                   eq(2)
    expect(Pin.on_projects.size).to        eq(1)
    expect(Pin.on_organizations.size).to   eq(1)
    expect(Pin.on_cancer_types.size).to    eq(0)
  end

  it 'Specific project pins count' do
    expect(@project.pins.size).to          eq(1)
    expect(@project.posts.size).to         eq(1)
  end

  it 'Specific post relations count' do
    expect(@post.projects.size).to         eq(1)
    expect(@post.organizations.size).to    eq(1)
    expect(@post.cancer_types.size).to     eq(0)
  end
end
