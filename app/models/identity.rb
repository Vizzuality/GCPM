# == Schema Information
#
# Table name: identities
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  provider   :string
#  uid        :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Identity < ActiveRecord::Base
  belongs_to :user

  validates_presence_of   :uid, :provider
  validates_uniqueness_of :uid, scope: :provider

  def self.for_oauth(auth)
    where(uid: auth.uid, provider: auth.provider).first_or_create
  end
end
