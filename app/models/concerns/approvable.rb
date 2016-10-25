# frozen_string_literal: true
module Approvable
  extend ActiveSupport::Concern

  included do
    scope :filter_approved,   -> { where(is_approved: true).where.not(user_id: nil)  }
    scope :filter_unapproved, -> { where(is_approved: false).where.not(user_id: nil) }

    def approve
      update is_approved: true
    end

    def unapprove
      update is_approved: false
    end

    def unapproved?
      !approved? && !user_id.nil?
    end

    def approved?
      is_approved?
    end

    def approved_status
      is_approved? ? 'approved' : 'unapproved'
    end
  end

  class_methods do
  end
end
