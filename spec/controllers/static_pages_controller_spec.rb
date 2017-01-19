require 'rails_helper'

RSpec.describe StaticPagesController, type: :controller do
  before :each do
    @page = create(:static_page, name: 'About page', body: 'Lorem ipsum dolor...')
  end

  it 'GET show returns http success' do
    process :show, params: { id: @page.slug }
    expect(response).to be_success
    expect(response).to have_http_status(200)
  end
end
