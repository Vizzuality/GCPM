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

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable, :lockable, :timeoutable,
         :omniauthable, omniauth_providers: [:linkedin, :google_oauth2]

  acts_as_followable

  enum role: { user: 0, admin: 1 }

  mount_uploader :avatar, AvatarUploader

  include Roleable

  TEMP_EMAIL_PREFIX = 'change@tmp'
  TEMP_EMAIL_REGEX = /\Achange@tmp/

  has_many :identities, dependent: :destroy

  acts_as_follower
  acts_as_messageable

  has_one  :investigator, inverse_of: :user
  has_many :project_users
  has_many :projects, through: :project_users
  has_many :events, inverse_of: :user
  has_many :posts

  before_save :check_authentication_token

  validates_uniqueness_of :email
  validates_presence_of   :name
  validates_format_of     :email, without: TEMP_EMAIL_REGEX, on: :update

  accepts_nested_attributes_for :projects

  def mailboxer_email(object)
    nil
  end

  def published_projects
    projects.published.includes(:cancer_types)
  end

  def unpublished_projects
    projects.unpublished.includes(:cancer_types) | projects.under_revision.includes(:cancer_types)
  end

  def email_verified?
    email && email !~ TEMP_EMAIL_REGEX
  end

  def unread_messages
    Mailboxer::Receipt.recipient(self).is_unread.not_trash.count
  end

  class << self
    def fetch_all(options)
      where("email ilike ? or name ilike ?", "%#{options}%","%#{options}%").where.not('confirmed_at is null')
    end
    def for_oauth(auth, signed_in_resource = nil)
      identity = Identity.for_oauth(auth)
      user     = signed_in_resource ? signed_in_resource : identity.user

      if user.nil?
        email    = auth.info.email
        name_atr = "#{auth.info.first_name} #{auth.info.last_name}"
        user     = User.where(email: email).first if email

        update_attr(user, name_atr, auth) if user

        if user.nil?
          user = User.new(
            email: email ? email : "#{TEMP_EMAIL_PREFIX}-#{auth.uid}-#{auth.provider}.com",
            password: Devise.friendly_token[0,20],
            name: name_atr
          )
          user.skip_confirmation!
          user.save!
        end
      end

      if identity.user != user
        identity.user = user
        identity.save!
      end

      user
    end

    def update_attr(user, name_atr, auth)
      update_attr = {}
      update_attr['name'] = name_atr if user.name.blank?
      update_attr
      user.update(update_attr)
    end
  end

  def check_authentication_token(destroy_true=nil)
    # ToDo: reset authentication_token after devise session destroy
    if destroy_true.present?
      query = "UPDATE users SET authentication_token=null, token_expires_at=null WHERE id=#{self.id}"
      ActiveRecord::Base.connection.execute(query)
    elsif
      self.authentication_token = generate_authentication_token
      set_token_expiration
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
