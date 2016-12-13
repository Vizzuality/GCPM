# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :inet
#  last_sign_in_ip        :inet
#  confirmation_token     :string
#  confirmed_at           :datetime
#  confirmation_sent_at   :datetime
#  failed_attempts        :integer          default(0), not null
#  unlock_token           :string
#  locked_at              :datetime
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  name                   :string
#  position               :string
#  twitter_account        :string
#  linkedin_account       :string
#  pubmed                 :string
#  authentication_token   :string
#  token_expires_at       :datetime
#  role                   :integer          default("user"), not null
#  avatar                 :string
#

require 'rails_helper'

RSpec.describe User, type: :model do
  before :each do
    @user = create(:user)
  end

  it 'Users count' do
    expect(User.count).to eq(1)
  end

  context "User's projects" do
    before :each do
      create(:project, title: 'First project', users: [@user], status: 2)
      create(:project, title: 'Second project', users: [@user], status: 1)
      create(:project, title: 'Third project', users: [@user], status: 0)
    end

    it 'Active inactive user projects' do
      expect(@user.published_projects.size).to   eq(1)
      expect(@user.unpublished_projects.size).to eq(2)
    end
  end
end
