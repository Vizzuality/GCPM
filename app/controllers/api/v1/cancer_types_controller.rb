module Api
  module V1
    class CancerTypesController < ApiController
      def index
        cancer_types = CancerType.all.select(:id, :name, :slug)
        render json: cancer_types
      end
    end
  end
end
