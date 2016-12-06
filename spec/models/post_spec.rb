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
    @project      = create(:project)
    @organization = create(:organization)
    create(:pin, pinable: @project, post: @post)
    create(:pin, pinable: @organization, post: @post)
  end

  it 'Pins count' do
    expect(Pin.count).to                   eq(2)
    expect(@project.pins.size).to          eq(1)
    expect(Pin.on_projects.size).to        eq(1)
    expect(Pin.on_organizations.size).to   eq(1)
    expect(Pin.on_cancer_types.size).to    eq(0)
    expect(@post.pins.size).to             eq(2)
    expect(@post.pins.on_projects.size).to eq(1)
  end
end
