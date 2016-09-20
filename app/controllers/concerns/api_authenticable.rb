module ApiAuthenticable
  extend ActiveSupport::Concern

  included do
    protect_from_forgery with: :null_session, only: Proc.new { |c| c.request.format.json? }
    skip_before_action :verify_request
    before_action :set_user_by_token

    def session_invalid?(object)
      object.token_expired? && current_user.blank?
    end

    def reset_auth_token(object)
      object.check_authentication_token(destroy_true: true)
      render json: { success: false, message: 'Please login again' }, status: 422
    end

    private

      def set_user_by_token
        if params[:token].present?
          @user = User.find_by(authentication_token: params[:token])
          if @user.blank?
            render json: { success: false, message: 'Please login again' }, status: 422
          elsif @user && session_invalid?(@user)
            reset_auth_token(@user)
          else
            return
          end
        else
          render json: { success: false, message: 'Please provide authentication token' }, status: 422
        end
      end
  end

  class_methods do
  end
end
