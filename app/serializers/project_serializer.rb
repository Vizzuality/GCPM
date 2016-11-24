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
#  created_by      :integer
#

class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :slug, :title, :summary, :project_website, :start_date, :end_date, :status

  has_many :funding_sources
  has_many :cancer_types
  has_many :specialities
  has_many :project_types
  has_many :users
  has_many :memberships, serializer: MembershipSerializer
end
