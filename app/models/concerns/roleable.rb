# frozen_string_literal: true
# User Roles: contributor, publisher, admin
module Roleable
  extend ActiveSupport::Concern

  included do
    scope :admin_users,     -> { where(role: 'admin')     }
    scope :users,           -> { where(role: 'user')      }
    scope :not_admin_users, -> { where.not(role: 'admin') }
    scope :not_users,       -> { where.not(role: 'user')  }

    def admin?
      role.in?('admin')
    end

    def user?
      role.in?('user')
    end

    def role_name
      case role
      when 'admin' then 'Admin'
      else
        'User'
      end
    end

  end

  class_methods do
  end
end
