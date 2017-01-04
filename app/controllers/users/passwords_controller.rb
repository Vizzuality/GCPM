# frozen_string_literal: true
module Users
  class Users::PasswordsController < Devise::PasswordsController
    before_action :build_user_data

    def build_user_data
      if current_user.present?
        if current_user.name && current_user.email
          user_initial = current_user.email[0].upcase
        else
          user_initial = 'U'
        end
        @user_data = JSON.generate({
          user_project: current_user.projects.count,
          user_event: Event.where("user_id = #{current_user.id}").count,
          user_initial: user_initial
        })

        @notifications = current_user.notifications.unread.recent.for_render
      end
    end
  end
end
