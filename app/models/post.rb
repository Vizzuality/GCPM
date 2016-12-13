# == Schema Information
#
# Table name: posts
#
#  id         :integer          not null, primary key
#  title      :string
#  body       :text
#  user_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Post < ApplicationRecord
  include ActAsFeatured
  belongs_to :user

  has_many :pins
  has_many :countries,     through: :pins, source: :pinable, source_type: 'Country'
  has_many :projects,      through: :pins, source: :pinable, source_type: 'Project'
  has_many :organizations, through: :pins, source: :pinable, source_type: 'Organization'
  has_many :cancer_types,  through: :pins, source: :pinable, source_type: 'CancerType'

  validates_presence_of :title, :body

  def build_pins(options)
    options.each do |pinable_type, pinable_ids|
      pinable_ids.each do |pinable_id|
        Pin.create(pinable_type: pinable_type.classify, pinable_id: pinable_id, post_id: self.id)
      end
    end
  end
end
