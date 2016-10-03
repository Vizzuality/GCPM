class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_action :build_user_data

  def build_user_data
    if current_user.present?
      if current_user.name && current_user.email
        user_initial = current_user.email[0].upcase
      else
        user_initial = 'U'
      end
      @user_data = JSON.generate({
        user_project: Project.where("user_id = #{current_user.id}").count,
        user_event: Event.where("user_id = #{current_user.id}").count,
        user_initial: user_initial
      })
    end
  end
end
