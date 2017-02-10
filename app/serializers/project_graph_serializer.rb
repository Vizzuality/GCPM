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
#  slug            :string
#

class ProjectGraphSerializer < ActiveModel::Serializer
  attributes :id, :slug, :title

  has_many :investigators, serializer: InvestigatorGraphSerializer
end
