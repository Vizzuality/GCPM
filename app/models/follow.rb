# == Schema Information
#
# Table name: follows
#
#  id              :integer          not null, primary key
#  followable_type :string           not null
#  followable_id   :integer          not null
#  follower_type   :string           not null
#  follower_id     :integer          not null
#  blocked         :boolean          default(FALSE), not null
#  created_at      :datetime
#  updated_at      :datetime
#
class Follow < ActiveRecord::Base
  extend ActsAsFollower::FollowerLib
  extend ActsAsFollower::FollowScopes

  after_create   :update_activity_feed
  after_update   :update_activity_feed,  if: 'blocked_changed? && blocked.blank?'
  after_update   :destroy_activity_feed, if: 'blocked_changed? && blocked.present?'
  before_destroy :destroy_activity_feed

  # NOTE: Follows belong to the "followable" interface, and also to followers
  belongs_to :followable, polymorphic: true
  belongs_to :follower,   polymorphic: true

  def block!
    self.update_attribute(:blocked, true)
  end

  private

    def update_activity_feed
      ActivityFeed.build(follower.id, 'following', followable_id, followable_type)
    end

    def destroy_activity_feed
      ActivityFeed.remove(follower.id, 'following', followable_id, followable_type)
    end
end
