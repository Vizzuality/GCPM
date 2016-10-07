# == Schema Information
#
# Table name: cancer_types
#
#  id          :integer          not null, primary key
#  name        :string
#  description :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class CancerType < ApplicationRecord
  has_and_belongs_to_many :projects
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
