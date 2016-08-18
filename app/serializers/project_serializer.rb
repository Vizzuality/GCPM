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
#  user_id         :integer
#

class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :title

  has_many :investigators
  has_many :organizations
end
