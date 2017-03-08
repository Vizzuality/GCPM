module Api
  module V1
    class MapController < ApiController
      def index
        type  = params[:data] && (params[:data] == 'events' || params[:data] == 'people') ? params[:data] : 'projects'
        group = if params[:group] && ['countries', 'regions', 'points'].include?(params[:group])
                  params[:group]
                elsif params[:id].present?
                  'points'
                else
                  'regions'
                end
        query = SqlQuery.new("#{type}_map_#{group}", params: map_params)
        json_list = query.execute
        render json: json_list
      end

      def show_project
        project = Project.set_by_id_or_slug(params[:id])
        render json: project.addresses.uniq, each_serializer: MapProjectSerializer, project: project
      end

      def show_event
        @event = Event.set_by_id_or_slug(params[:id])
        render json: [@event], each_serializer: MapEventSerializer
      end

      def csv_download
        query     = SqlQuery.new('projects_map_download', params: map_params)
        json_list = query.execute
        file_name = "projects-#{Date.today}.csv"
        if json_list.any?
          @data_to_export = ExcelExporter.new(json_list)
          send_data @data_to_export.to_csv.force_encoding('iso-8859-1'), type: 'text/csv; charset=iso-8859-1; header=present', disposition: "attachment; filename=#{file_name}"
        else
          render json: { success: true, message: 'No data to download' }, status: 200
        end
      end

      private

        def map_params
          params.permit(:id, :format, :user, :start_date, :data, :end_date, project_types:[], countries:[], cancer_types:[], organization_types:[], organizations:[], regions:[], investigators:[], funding_sources:[], specialities: [])
        end
    end
  end
end
