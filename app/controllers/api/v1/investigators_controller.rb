module Api::V1
  class InvestigatorsController < ApiController
    include ApiAuthenticable

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

      def set_investigator
        @investigator = Investigator.find(params[:id])
      end

      def investigator_params
        params.require(:investigator).permit!
      end
  end
end
