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
  enum status: [:under_revision, :published, :unpublished]
  has_many :memberships
  has_many :investigators, through: :memberships
  has_many :organizations, through: :memberships
  has_many :secondary_investigators,-> {where(memberships: {membership_type: 1})}, through: :memberships
  has_many :secondary_organizations,-> {where(memberships: {membership_type: 1})}, through: :memberships
  has_many :funding_sources,-> {where(memberships: {membership_type: :funding})}, through: :memberships, source: :organization
  has_and_belongs_to_many :project_types
  has_and_belongs_to_many :cancer_types
  scope :active, -> {where('projects.end_date >= ? AND projects.start_date <= ?', Time.now, Time.now).or(where('projects.end_date IS NULL'))}
  scope :inactive, -> {where('projects.end_date < ?', Time.now).or('projects.start_date > ?', Time.now)}
  def project_lead
    investigators.where(memberships: {membership_type: 0}).first
  end
  def main_organization
    organizations.where(memberships: {membership_type: 0}).first
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
