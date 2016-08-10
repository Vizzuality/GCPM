module Api::V1
  class OrganizationsController < ApiController
    include ApiAuthenticable

    before_action :set_user_by_token
    before_action :set_organization, except: [:index, :index_countries]

    def index
      # ToDo: implementation of organization search by name
      organizations = Organization.all
      render json: organizations, each_serializer: OrganizationArraySerializer
    end

    def show
      render json: @organization, serializer: OrganizationSerializer
    end

    def index_countries
      countries = Country.all
      render json: countries, each_serializer: OrganizationArraySerializer
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

      def set_organization
        @organization = Organization.find(params[:id])
      end

      def organization_params
        params.require(:organization).permit!
      end
  end
end
