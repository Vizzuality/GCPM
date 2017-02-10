# frozen_string_literal: true
# == Schema Information
#
# Table name: project_users
#
#  id          :integer          not null, primary key
#  project_id  :integer
#  user_id     :integer
#  is_approved :boolean          default(FALSE)
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class ProjectUser < ApplicationRecord
  include Approvable

  belongs_to :user
  belongs_to :project
end
