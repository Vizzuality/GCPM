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

class ActivityFeed < ActiveRecord::Base
  belongs_to :actionable, polymorphic: true
  belongs_to :user

  VALID_ACTIONS = %w(following)

  validates :action, inclusion: { in: VALID_ACTIONS }

  scope :on_projects,      -> { where(actionable_type: 'Project')      }
  scope :on_organizations, -> { where(actionable_type: 'Organization') }
  scope :on_cancer_type,   -> { where(actionable_type: 'CancerType')   }
  scope :on_countries,     -> { where(actionable_type: 'Country')      }
  scope :on_events,        -> { where(actionable_type: 'Event')        }
  scope :on_users,         -> { where(actionable_type: 'User')         }
  scope :for_render,       -> { includes(:actionable)                  }

  class << self
    def build(user_id, action, actionable_id, actionable_type)
      where(user_id: user_id, action: action.to_s, actionable_id: actionable_id, actionable_type: actionable_type).first_or_create
    end

    def remove(user_id, action, actionable_id, actionable_type)
      activity = find_by(user_id: user_id, action: action, actionable_id: actionable_id, actionable_type: actionable_type)
      activity.destroy if activity.present?
    end

    def on(actionable)
      where(actionable: actionable)
    end

    def by(user)
      where(user: user)
    end
  end
end
