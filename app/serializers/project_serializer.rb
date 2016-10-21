# == Schema Information
#
# Table name: projects
#
#  id              :integer          not null, primary key
#  title           :string
#  summary         :text
#  project_website :text
#  start_date      :date
#  end_date        :date
#  status          :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :title

  has_many :investigators
  has_many :organizations
  has_many :funding_sources
  has_many :cancer_types
  has_many :project_types
end
