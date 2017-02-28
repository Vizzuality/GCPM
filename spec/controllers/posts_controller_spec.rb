require 'rails_helper'

RSpec.describe PostsController, type: :controller do
  before :each do
    @user = create(:user)
    @post = create(:post, title: 'Second post', user: @user)
  end

  it 'GET edit returns http success' do
    process :show, params: { id: @post.id }
    expect(response).to be_success
    expect(response).to have_http_status(200)
  end

  context 'For authenticated user' do
    before :each do
      @post_1 = create(:post, title: 'First post', user: @user)
      sign_in @user
    end

    it 'Update post' do
      process :update, method: :patch, params: { id: @post_1.id, post: { title: 'Updated post', cancer_types: [1,2] } }
      expect(response).to be_redirect
      expect(response).to have_http_status(302)

      expect(@user.posts.size).to                  be(2)
      expect(@post_1.pins.size).to                 be(2)
      expect(@post_1.pins.on_cancer_types.size).to be(2)
    end

    it 'Create post' do
      process :create, method: :post, params: { post: { title: 'Created post', cancer_types: [1,2], countries: [1], projects: [1,2,3], organizations: [1,2,3,4], body: 'Lorem ipsum' } }
      expect(response).to be_redirect
      expect(response).to have_http_status(302)

      expect(Post.find_by(title: 'Created post').pins.size).to                  be(10)
      expect(Post.find_by(title: 'Created post').pins.on_cancer_types.size).to  be(2)
      expect(Post.find_by(title: 'Created post').pins.on_countries.size).to     be(1)
      expect(Post.find_by(title: 'Created post').pins.on_projects.size).to      be(3)
      expect(Post.find_by(title: 'Created post').pins.on_organizations.size).to be(4)
    end
  end
end
