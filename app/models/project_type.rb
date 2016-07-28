# == Schema Information
#
# Table name: project_types
#
#  id         :integer          not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class ProjectType < ApplicationRecord
  has_and_belongs_to_many :projects
end
