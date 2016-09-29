module Api
  module V1
    class LayersController < ApiController
      def index
        @layers = Layer.fetch_all(layers_params)
        render json: @layers, meta: { total_layers: @layers.size }, include: ['layer_groups', 'source'], site_scope: layers_params[:site_scope].to_i
      end

      private

        def layers_params
          params.permit()
        end
    end
  end
end
