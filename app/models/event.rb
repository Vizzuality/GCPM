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
#  latitute     :float
#  longitude    :float
#  postcode     :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class Event < ApplicationRecord
  validates_presence_of :title, :description
end
