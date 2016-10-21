module Api
  module V1
    class LayersController < ApiController
      def index
        @layers = Layer.fetch_all(layers_params)
        render json: @layers, meta: { total_layers: @layers.size }, each_serializer: LayerSerializer, include: 'layer_group'
      end

      private

        def layers_params
          params.permit()
        end
    end
  end
end
