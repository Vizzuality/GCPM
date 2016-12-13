# == Schema Information
#
# Table name: activity_feeds
#
#  id              :integer          not null, primary key
#  user_id         :integer
#  action          :string
#  actionable_type :string
#  actionable_id   :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

require 'rails_helper'

RSpec.describe ActivityFeed, type: :model do
  before :each do
    @user     = create(:user)
    @event    = create(:event, title: 'Test event')
    @activity = create(:activity, actionable: @event, user: @user, action: 'following')
  end

  context "Valid activity" do
    it 'Activity to be valid' do
      expect(@activity).to                   be_valid
      expect(@activity.user_id).to           eq(@user.id)
      expect(@activity.actionable_type).to   eq('Event')
      expect(@activity.action).to            eq('following')
      expect(ActivityFeed.on_events.size).to eq(1)
    end

    it "Activity should be valid for different actionables" do
      expect(build(:activity, actionable: create(:project))).to      be_valid
      expect(build(:activity, actionable: create(:organization))).to be_valid
    end

    it "Activity should be a valid only with allowed actions" do
      expect(build(:activity, action: 'following')).to    be_valid
      expect(build(:activity, action: 'notvalid')).not_to be_valid
    end
  end

  context 'List of user activities' do
    it 'User activities count' do
      expect(@user.activity_feeds.size).to eq(1)
    end
  end

  context 'on' do
    it 'should list all activity on an actionable object' do
      project      = create(:project)
      organization = create(:organization)
      activity1    = create(:activity, action: 'following', actionable: project)
      activity2    = create(:activity, action: "following", actionable: organization)

      expect(ActivityFeed.on(project).size).to      eq(1)
      expect(ActivityFeed.on(organization).size).to eq(1)
      expect(ActivityFeed.on(project)).to           include(activity1)
      expect(ActivityFeed.on(organization)).to      include(activity2)
    end
  end

  context 'by' do
    it 'should list all activity of a user' do
      user1     = create(:user)
      activity1 = create(:activity, user: user1, action: "following", actionable: create(:project))
      activity2 = create(:activity, user: user1, action: "following", actionable: create(:organization))
      create_list(:activity, 2)

      expect(ActivityFeed.by(user1).size).to eq(2)

      [activity1, activity2].each do |a|
        expect(ActivityFeed.by(user1)).to include(a)
      end
    end
  end

  context 'scopes by actionable' do
    it 'should filter by actionable type' do
      on_project      = create(:activity, actionable: create(:project))
      on_organization = create(:activity, actionable: create(:organization))
      on_user         = create(:activity, actionable: create(:user))

      expect(ActivityFeed.on_projects.size).to      eq(1)
      expect(ActivityFeed.on_organizations.size).to eq(1)
      expect(ActivityFeed.on_users.size).to         eq(1)

      expect(ActivityFeed.on_projects.first).to      eq(on_project)
      expect(ActivityFeed.on_organizations.first).to eq(on_organization)
      expect(ActivityFeed.on_users.first).to         eq(on_user)
    end
  end
end
