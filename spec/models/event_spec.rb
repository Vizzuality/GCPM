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

require 'rails_helper'

RSpec.describe Event, type: :model do
  before :each do
    @event = create(:event, title: 'Test event', website: 'test-web.org')
  end

  context "Valid investigator" do
    it 'Slug presentation' do
      expect(@event).to         be_valid
      expect(@event.slug).to    be_present
      expect(@event.slug).to    eq('test-event')
      expect(@event.website).to eq('http://test-web.org')
    end
  end
end
