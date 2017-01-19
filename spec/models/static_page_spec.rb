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
    Rails.application.routes_reloader.reload!
  end

  context "Valid page" do
    it 'Slug presentation' do
      @page = build(:static_page, name: 'My page')
      expect(@page).to             be_valid
      expect(@page.slug).to        be_present
      expect(@page.slug).to        eq('my-page')
      expect(@page.path_prefix).to eq('my_page')
    end
  end

  context "Not valid page" do
    before :each do
      @page = create(:static_page, name: 'About page')
    end

    it 'Name validation' do
      @page_reject = build(:static_page, name: 'About page')

      @page_reject.valid?
      expect {@page_reject.save!}.to raise_error(ActiveRecord::RecordInvalid, "Validation failed: Name has already been taken")
    end

    it 'Slug validation' do
      @page_reject = build(:static_page, name: 'About page new', slug: 'about-page', path_prefix: 'about_page_new')

      @page_reject.valid?
      expect {@page_reject.save!}.to raise_error(ActiveRecord::RecordInvalid, "Validation failed: Slug invalid route name, slug already in use: 'about-page'! Please chenge the existing route name in the routes file or provide a new slug., Slug has already been taken, Slug has already been taken")
    end

    it 'Prefix validation' do
      @page_reject = build(:static_page, name: 'About page new', path_prefix: 'about_page')

      @page_reject.valid?
      expect {@page_reject.save!}.to raise_error(ActiveRecord::RecordInvalid, "Validation failed: Path prefix has already been taken")
    end
  end
end
