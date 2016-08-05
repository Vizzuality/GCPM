module Api::V1
  class InvestigatorsController < ApiController
    include ApiAuthenticable

    before_action :set_user_by_token
    before_action :set_investigator, except: [:index, :create]

    def index
      # ToDo: implementation of investigator search by name
      investigators = Investigator.all
      render json: investigators, each_serializer: InvestigatorArraySerializer
    end

    def show
      render json: @investigator, serializer: InvestigatorSerializer
    end

    def update
      if @investigator.update(investigator_params)
        render json: { success: true, message: 'Investigator updated!' }, status: 200
      else
        render json: { success: false, message: 'Error updating investigator' }, status: 422
      end
    end

    def create
      @investigator = Investigator.new(investigator_params)
      if @investigator.save
        render json: @investigator, serializer: InvestigatorSerializer, status: 201
      else
        render json: { success: false, message: 'Error creating investigator' }, status: 422
      end
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

      def set_investigator
        @investigator = Investigator.find(params[:id])
      end

      def investigator_params
        params.require(:investigator).permit!
      end
  end
end
