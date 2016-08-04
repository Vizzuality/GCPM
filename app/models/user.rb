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
#

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable, :lockable, :timeoutable

  has_many :projects, inverse_of: :user
  has_many :events, inverse_of: :user

  before_save :check_authentication_token

  def published_projects
    projects.published.includes(:cancer_types)
  end

  def unpublished_projects
    projects.unpublished.includes(:cancer_types) | projects.under_revision.includes(:cancer_types)
  end

  def check_authentication_token(destroy_true=nil)
    # ToDo: reset authentication_token after devise session destroy
    if self.authentication_token.blank? #|| self.current_sign_in_at.present? && self.current_sign_in_at >= self.token_expires_at
      self.authentication_token = generate_authentication_token
      set_token_expiration
    elsif destroy_true.present?
      query = "UPDATE users SET authentication_token=null, token_expires_at=null WHERE id=#{self.id}"
      ActiveRecord::Base.connection.execute(query)
    end
  end

  def token_expired?
    token_expires_at.present? && DateTime.now >= token_expires_at unless remember_exists_and_not_expired?
  end

  def remember_exists_and_not_expired?
    return false unless respond_to?(:remember_created_at) && respond_to?(:remember_expired?)
    remember_created_at && !remember_expired?
  end

  private

    def generate_authentication_token
      loop do
        auth_key = Devise.friendly_token[0,20]
        break auth_key unless User.where(authentication_token: auth_key).first
      end
    end

    def set_token_expiration
      self.token_expires_at = DateTime.now + timeout_in
    end
end
