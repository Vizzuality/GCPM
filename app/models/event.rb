# == Schema Information
#
# Table name: events
#
#  id           :integer          not null, primary key
#  title        :string
#  description  :text
#  website      :text
#  excerpt      :text
#  participants :text
#  start_date   :date
#  end_date     :date
#  private      :boolean
#  online       :boolean
#  address      :text
#  address2     :text
#  city         :string
#  country      :string
#  state        :string
#  latitude     :float
#  longitude    :float
#  postcode     :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :integer
#

class Event < ApplicationRecord
  belongs_to :user, inverse_of: :events

  validates_presence_of :title, :description
  scope :by_user, -> user { where('events.user_id = ?', user ) }

  def self.fetch_all(options)
    events = Event.all
    events = events.by_user(options[:user]) if options[:user]
    events = events.uniq
  end
end
