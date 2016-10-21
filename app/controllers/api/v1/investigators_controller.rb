module Api::V1
  class InvestigatorsController < ApiController
    include ApiAuthenticable

    before_action :set_investigator,  only: [:show, :update]
    before_action :check_permissions, only: :update

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
        render json: @investigator, serializer: InvestigatorSerializer, status: 200
      else
        render json: { success: false, message: @investigator.errors.full_messages.join(', ') }, status: 422
      end
    end

    def create
      @investigator = Investigator.new(investigator_params)
      if @investigator.save
        render json: @investigator, serializer: InvestigatorSerializer, status: 201
      else
        render json: { success: false, message: @investigator.errors.full_messages.join(', ') }, status: 422
      end
    end

    private

      def set_investigator
        @investigator = Investigator.find(params[:id])
      end

      def check_permissions
        if @user != Investigator.find(params[:id]).user
          render json: { success: false, message: 'Permission denied!' }, status: 422
        end
      end

      def investigator_params
        params.require(:investigator).permit!.tap do |investigator_params|
          investigator_params[:user_id] = @user.id if params.require(:investigator)[:assign_to_user].present?
        end
      end
  end
end
