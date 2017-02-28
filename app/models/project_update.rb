# == Schema Information
#
# Table name: project_updates
#
#  id         :integer          not null, primary key
#  title      :string
#  body       :text
#  project_id :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class ProjectUpdate < ApplicationRecord
  belongs_to :project
end
