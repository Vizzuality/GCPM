module ApiAuthenticable
  extend ActiveSupport::Concern

  included do
    protect_from_forgery with: :null_session, only: Proc.new { |c| c.request.format.json? }
    skip_before_action :verify_request

    def session_invalid?(object)
      # object.token_expired? && session[:user_id].blank?
    end

    def reset_auth_token(object)
      object.check_authentication_token(destroy_true: true)
      render json: { success: false, message: 'Please login again' }, status: 422
    end
  end

  class_methods do
  end
end
