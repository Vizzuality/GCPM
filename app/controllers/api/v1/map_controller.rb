module Api
  module V1
    class MapController < ApiController
      def index
        type = params[:type] && (params[:type] == 'events' || params[:type] == 'people') ? params[:type] : 'projects'
        group = params[:group] && ['countries', 'regions', 'points'].include?(params[:group]) ? params[:group] : 'regions'
        query = SqlQuery.new("#{type}_map_#{group}", params: map_params)
        json_list = query.execute
        render json: json_list
      end

      def show_project
        project = Project.find(params[:id])
        @addresses = project.addresses
        render json: @addresses, each_serializer: MapProjectSerializer, project: project
      end

      def show_event
        @event = Event.find(params[:id])
        render json: [@event], each_serializer: MapEventSerializer
      end

      def map_params
        params.permit(:user, :start_date, :end_date, project_types:[], countries:[], cancer_types:[], organization_types:[], organizations:[], regions:[], investigators:[])
      end
    end
  end
end
