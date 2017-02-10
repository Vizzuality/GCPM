module Api
  module V1
    class WidgetsController < ApiController
      def index
        widgets = Widget.all
        render json: widgets, meta: { total_widgets: widgets.size }, each_serializer: WidgetSerializer
      end
    end
  end
end
