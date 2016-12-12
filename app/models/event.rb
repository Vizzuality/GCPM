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
#  slug         :string
#

class Event < ApplicationRecord
  acts_as_followable

  after_update :notify_users_for_update
  after_create :notify_users_for_create, if: 'user_id.present?'

  belongs_to :user, inverse_of: :events

  validates_presence_of :title, :description
  validates :slug, presence: true, format: { with: /\A[^\s!#$%^&*()（）=+;:'"\[\]\{\}|\\\/<>?,]+\z/,
                                             allow_blank: true,
                                             message: 'Invalid. Slug must contain at least one letter and no special character' }
  validates_uniqueness_of :title, :slug

  validate :dates_timeline

  include Sluggable
  include ActAsFeatured

  def country_object
    Country.find_by(country_name: self.country)
  end

  def dates_timeline
    if self.start_date.present? && self.end_date.present?
      errors.add(:end_date, 'must be after start date') if self.start_date > self.end_date
    end
  end

  scope :by_user,       -> user       { where('events.user_id = ?', user ) }
  scope :by_countries,  -> countries  { joins('inner join countries on events.country = countries.country_name').where(countries: { country_iso_3: countries })  }
  scope :by_regions,    -> regions    { joins('inner join countries on events.country = countries.country_name').where(countries: { region_iso: regions }) }
  scope :by_start_date, -> start_date { where('events.start_date > ?', start_date ) }
  scope :by_end_date,   -> end_date   { where('events.end_date < ?', end_date ) }

  class << self
    def fetch_all(options={})
      events = Event.all
      events = events.by_countries(options[:countries])    if options[:countries]
      events = events.by_regions(options[:regions])        if options[:regions]
      events = events.by_user(options[:user])              if options[:user]
      events = events.by_start_date(options[:start_date])  if options[:start_date]
      events = events.by_end_date(options[:end_date])      if options[:end_date]
      events = events.order('events.created_at ASC')       if options[:sortby] && options[:sortby] == 'created_asc'
      events = events.order('events.created_at DESC')      if options[:sortby] && options[:sortby] == 'created_desc'
      events = events.order('events.title ASC')            if options[:sortby] && options[:sortby] == 'title_asc'
      events = events.order('events.title DESC')           if options[:sortby] && options[:sortby] == 'title_desc'
      events.distinct
    end

    def set_by_id_or_slug(param)
      object_id = where(slug: param).or(where(id: param)).pluck(:id).min
      find(object_id) if object_id.present?
    end
  end

  private

    def check_slug
      self.slug = self.title.downcase.parameterize if self.title.present? && self.slug.blank?
    end

    def assign_slug
      self.slug = self.slug.downcase.parameterize
    end

    def notify_users_for_update
      users = ActivityFeed.where(actionable_type: 'Event', actionable_id: self.id, action: 'following').pluck(:user_id)
      Notification.build(users, self, 'was updated')
    end

    def notify_users_for_create
      users   = ActivityFeed.where(actionable_type: 'User', actionable_id: user_id, action: 'following').pluck(:user_id)
      creator = User.find(user_id).try(:name)
      Notification.build(users, self, "was created by #{creator}")
    end
end
