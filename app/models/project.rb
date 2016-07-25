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

class Project < ApplicationRecord
  has_many :members
  has_many :investigators, through: :members
  has_many :organizations, through: :members
  has_many :secondary_investigators,-> {where.not(members: {membership_type: 0})}, through: :members
  has_many :secondary_organizations,-> {where.not(members: {membership_type: 0})}, through: :members
  has_many :funding_sources,-> {where(members: {membership_type: :funding})}, through: :members, source: :organization
  enum status: [:under_revision, :published, :unpublished]
  scope :active, -> {where('projects.end_date >= ? AND projects.start_date <= ?', Time.now, Time.now).or(where('projects.end_date IS NULL'))}
  scope :inactive, -> {where('projects.end_date < ?', Time.now).or('projects.start_date > ?', Time.now)}
  def project_lead
    investigators.where(members: {membership_type: 0}).first
  end
  def main_organization
    organizations.where(members: {membership_type: 0}).first
  end
  def active
    self.end_date > Time.now && self.start_date < Time.now if self.start_date && self.end_date
  end
  def inactive
    self.end_date < Time.now && self.start_date < Time.now if self.start_date && self.end_date
  end
  def publish
    self.status = :published
    save
  end
  def unpublish
    self.status = :unpublished
    save
  end
end
