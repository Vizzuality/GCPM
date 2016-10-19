module Users
  class SessionsController < Devise::SessionsController
    before_action :destroy_session, only: :destroy

    # GET /resource/sign_in
    def new
      super
    end

    # POST /resource/sign_in
    def create
      super
    end

    # DELETE /resource/sign_out
    def destroy
      super
    end

    private

      def destroy_session
        current_user.check_authentication_token(destroy_true: true)
      end
  end
end
