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

class Notification < ActiveRecord::Base
  belongs_to :user, counter_cache: true
  belongs_to :notificable, polymorphic: true

  scope :unread,      -> { all                    }
  scope :recent,      -> { order(id: :desc)       }
  scope :not_emailed, -> { where(emailed_at: nil) }
  scope :for_render,  -> { includes(:notificable) }

  class << self
    def build(users, notificable, summary)
      notifications = []
      notifications_size = 1000
      users.each do |user_id|
        notifications << Notification.new(user_id: user_id, notificable: notificable, summary: build_summary(notificable, summary))
        if notifications.size >= notifications_size
          Notification.import notifications
          notifications = []
        end
      end
      Notification.import notifications
      rebuild_counters
    end

    def build_summary(notificable, summary_action)
      summary  = "The #{notificable.model_name.human} "
      summary += notificable_title(notificable)
      summary += ' '
      summary += summary_action
      summary
    end

    def notificable_title(notificable)
      notificable.try(:title) || notificable.try(:name)
    end

    def rebuild_counters
      ActiveRecord::Base.connection.execute <<-SQL
        UPDATE users SET notifications_count = (SELECT count(1)
                                                FROM notifications
                                                WHERE notifications.user_id = users.id)
      SQL
    end

    # On development
    # whenever --update-crontab --set environment='development'
    # if /bin/bash: shell_session_update: command not found please run:
    # rvm get head

    def daily_notifications_task
      user_ids = Notification.not_emailed.pluck(:user_id).uniq
      user_ids.each do |user_id|
        user          = User.find(user_id)
        if user.notifications_mailer?
          user_name     = user.name || user.email
          user_email    = user.email
          summary_items = user.notifications.not_emailed
          NotificationMailer.daily_summary_email(user_name, user_email, summary_items.to_a).deliver_now
          mark_as_emailed(summary_items.pluck(:id))
        end
      end
    end

    def mark_as_emailed(ids)
      date_now = Time.now.to_formatted_s(:db)
      ActiveRecord::Base.connection.execute <<-SQL
        UPDATE notifications SET emailed_at = '#{date_now}'
                             WHERE notifications.id = ANY(ARRAY#{ids});
      SQL
    end
  end

  def notificable_title
    summary
  end

  def notificable_group
    notificable.model_name.human
  end

  def timestamp
    notificable.updated_at.to_formatted_s(:short)
  end

  def mark_as_read
    self.destroy
  end
end
