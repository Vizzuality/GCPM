# == Schema Information
#
# Table name: static_pages
#
#  id          :integer          not null, primary key
#  name        :string
#  slug        :string
#  path_prefix :string
#  body        :text
#  published   :boolean          default(TRUE)
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

require 'rails_helper'

RSpec.describe StaticPage, type: :model do
  before :each do
    @page = create(:static_page, name: 'About page')
  end

  context "Valid page" do
    it 'Slug presentation' do
      expect(@page).to      be_valid
      expect(@page.slug).to be_present
      expect(@page.slug).to eq('about-page')
    end
  end
end
