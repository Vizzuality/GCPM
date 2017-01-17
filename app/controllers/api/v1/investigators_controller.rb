module Api::V1
  class InvestigatorsController < ApiController
    include ApiAuthenticable

    before_action :set_investigator,       only: [:show, :update, :graph]
    before_action :check_permissions,      only: :update
    skip_before_action :set_user_by_token, only: [:graph, :index, :show]

    def index
      investigators = Investigator.fetch_all(investigators_params)
      render json: investigators, each_serializer: InvestigatorArraySerializer
    end

    def show
      render json: @investigator, serializer: InvestigatorSerializer
    end

    def graph
      render json: @investigator.graph, each_serializer: ProjectGraphSerializer
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
        @investigator = Investigator.set_by_id_or_slug(params[:id])
      end

      def check_permissions
        if @user != Investigator.set_by_id_or_slug(params[:id]).user
          render json: { success: false, message: 'Permission denied!' }, status: 422
        end
      end

      def investigator_params
        params.require(:investigator).permit!.tap do |investigator_params|
          investigator_params[:user_id] = @user.id if params.require(:investigator)[:assign_to_user].present?
        end
      end

      def investigators_params
        params.permit(:q)
      end
  end
end
