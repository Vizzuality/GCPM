class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session, only: Proc.new { |c| c.json_request? }

  before_action :expire_xhr_requests
  before_action :build_user_data
  before_action :configure_permitted_parameters, if: :devise_controller?
  after_action  :set_csrf_cookie, :store_location
  after_action  :store_location

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

    def store_location
      return unless request.get?
      if request.path != '/users/sign_in' &&
          request.path != '/users/password/new' &&
          request.path != '/users/password/edit' &&
          request.path != '/users/sign_up' &&
          request.path != '/users/edit' &&
          request.path != '/users/password' &&
          request.path != '/users/cancel' &&
          request.path != "/users/confirmation" &&
          request.path != "/users/sign_out" &&
          !request.xhr? # don't store ajax calls
        session['user_return_to'] = request.fullpath
      end
    end

    def expire_xhr_requests
      if request.xhr?
        response.headers['Cache-Control'] = 'no-cache, no-store'
      end
    end

    def after_sign_in_path_for(*)
      session['user_return_to'] || root_path
    end

    def set_csrf_cookie
      if protect_against_forgery?
        cookies['X-CSRF-Token'] = form_authenticity_token
      end
    end

    def json_request?
      request.format.json?
    end
end
