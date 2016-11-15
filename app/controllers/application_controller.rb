class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_action :build_user_data
  before_action :configure_permitted_parameters, if: :devise_controller?



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
    end
  end

  def authenticate_admin_user!
    authenticate_user!
    unless current_user.admin?
      flash[:alert] = 'Unauthorized Access!'
      redirect_to root_path
    end
  end

  rescue_from CanCan::AccessDenied do |exception|
    redirect_to root_url, alert: exception.message
  end

  protected
    def configure_permitted_parameters
       devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :avatar])
    end
end
