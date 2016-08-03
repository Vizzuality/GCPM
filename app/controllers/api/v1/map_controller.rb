module Api
  module V1
    class MapController < ApiController
      def index
        case params[:group]
        when 'regions'
          query = SqlQuery.new(:map_regions, params: map_params)
        when 'countries'
          query = SqlQuery.new(:map_countries, params: map_params)
        when 'projects'
          query = SqlQuery.new(:map_projects, params: map_params)
        else
          query = SqlQuery.new(:map_regions, params: map_params)
        end
        json_list = query.execute
        render json: json_list
      end

      def map_params
        params.permit(:start_date, :end_date, project_types:[], countries:[], cancer_types:[], organization_types:[], organizations:[], regions:[])
      end
    end
  end
end

