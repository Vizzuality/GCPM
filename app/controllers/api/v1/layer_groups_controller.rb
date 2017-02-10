module Api
  module V1
    class LayerGroupsController < ApiController
      def index
        @layer_groups = LayerGroup.fetch_all(layer_groups_params)
        render json: @layer_groups, meta: { total_layer_groups: @layer_groups.size }
      end

      private

        def layer_groups_params
          params.permit()
        end
    end
  end
end
