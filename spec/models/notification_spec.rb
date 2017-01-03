# == Schema Information
#
# Table name: notifications
#
#  id               :integer          not null, primary key
#  user_id          :integer
#  notificable_type :string
#  notificable_id   :integer
#  summary          :text
#  counter          :integer          default(1)
#  emailed_at       :datetime
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

require 'rails_helper'

RSpec.describe Notification, type: :model do
  describe "#unread (scope)" do
    it "returns only unread notifications" do
      create :notification
      organization = create :organization
      create :notification, notificable: organization
      expect(Notification.unread.size).to eq(2)
    end
  end

  describe "#recent (scope)" do
    it "returns notifications sorted by id descendant" do
      organization = create :organization
      old_notification = create :notification
      new_notification = create :notification, notificable: organization

      sorted_notifications = Notification.recent
      expect(sorted_notifications.size).to  eq(2)
      expect(sorted_notifications.first).to eq(new_notification)
      expect(sorted_notifications.last).to  eq(old_notification)
    end
  end

  describe "#for_render (scope)" do
    it "returns notifications including notificable and user" do
      expect(Notification).to receive(:includes).with(:notificable).exactly(:once)
      Notification.for_render
    end
  end

  describe "#timestamp" do
    it "returns the timestamp of the trackable object" do
      organization = create :organization
      notification = create :notification, notificable: organization

      expect(notification.timestamp).to eq(organization.updated_at.to_formatted_s(:short))
    end
  end

  describe "#mark_as_read" do
    it "destroys notification" do
      notification = create :notification
      expect(Notification.unread.size).to eq 1

      notification.mark_as_read
      expect(Notification.unread.size).to eq 0
    end
  end

  describe "#daily_notifications_task" do
    it "email notification" do
      notification = create :notification
      expect(Notification.unread.size).to eq 1

      Notification.daily_notifications_task
      expect(notification.reload.emailed_at.to_date).to eq(Time.now.to_date)
    end
  end
end
