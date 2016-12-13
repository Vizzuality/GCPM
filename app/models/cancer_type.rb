# == Schema Information
#
# Table name: cancer_types
#
#  id          :integer          not null, primary key
#  name        :string
#  description :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  slug        :string
#

class CancerType < ApplicationRecord
  acts_as_followable

  has_many :pins,  as: :pinable
  has_many :posts, through: :pins

  has_and_belongs_to_many :projects

  validates_presence_of   :name
  validates_uniqueness_of :name

  include Sluggable

  def projects_count
    self.projects.uniq.size
  end

  def organizations_count
    self.projects.joins(:organizations).count('distinct(organizations.id)')
  end

  def countries_count
    self.projects.joins(:countries).count('distinct(countries.id)')
  end
end
