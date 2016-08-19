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
  scope :by_user,      -> user      { where('events.user_id = ?', user ) }
  scope :by_countries, -> countries { joins('inner join countries on events.country = countries.country_name').where('countries.country_name in (?)', countries) }
  scope :by_regions,   -> regions  { joins('inner join countries on events.country = countries.country_name').where('countries.region_name in (?)', regions) }

  def self.fetch_all(options={})
    events = Event.all
    events = events.by_user(options[:user])              if options[:user]
    events = events.by_countries(options[:countries])    if options[:countries]
    events = events.by_regions(options[:regions])        if options[:regions]
    events = events.order('events.created_at ASC')       if options[:sortby] && options[:sortby] == 'created_asc'
    events = events.order('events.created_at DESC')      if options[:sortby] && options[:sortby] == 'created_desc'
    events = events.order('events.title ASC')            if options[:sortby] && options[:sortby] == 'title_asc'
    events = events.order('events.title DESC')           if options[:sortby] && options[:sortby] == 'title_desc'
    events = events.uniq
  end
end
