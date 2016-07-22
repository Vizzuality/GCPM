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
  def active
    self.end_date > Time.now && self.start_date < Time.now if self.start_date && self.end_date
  end
  def inactive
    self.end_date < Time.now && self.start_date < Time.now if self.start_date && self.end_date
  end
  def state
    case self.status
    when 0
      'under revision'
    when 1
      'published'
    when 2
      'unpublished'
    else
      'under revision'
    end
  end
  def publish
    self.status = 1
    save
  end
  def unpublish
    self.status = 2
    save
  end
end
