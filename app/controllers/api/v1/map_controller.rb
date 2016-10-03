module Api
  module V1
    class MapController < ApiController
      def index
        type = params[:data] && (params[:data] == 'events' || params[:data] == 'people') ? params[:data] : 'projects'
        group = params[:group] && ['countries', 'regions', 'points'].include?(params[:group]) ? params[:group] : 'regions'
        query = SqlQuery.new("#{type}_map_#{group}", params: map_params)
        json_list = query.execute
        render json: json_list
      end

      def show_project
        project = Project.find(params[:id])
        render json: project.addresses, each_serializer: MapProjectSerializer, project: project
      end

      def show_event
        @event = Event.find(params[:id])
        render json: [@event], each_serializer: MapEventSerializer
      end

      def map_params
        params.permit(:format, :user, :start_date, :data, :end_date, project_types:[], countries:[], cancer_types:[], organization_types:[], organizations:[], regions:[], investigators:[])
      end
    end
  end
end
