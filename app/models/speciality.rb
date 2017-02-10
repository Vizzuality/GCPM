# == Schema Information
#
# Table name: specialities
#
#  id         :integer          not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  slug       :string
#

class Speciality < ApplicationRecord
  has_and_belongs_to_many :projects

  has_many :pins,  as: :pinable
  has_many :posts, through: :pins

  include Sluggable
end
