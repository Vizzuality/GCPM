module Api
  module V1
    class MapController < ApiController
      def index
        case params[:group]
        when 'regions'
          query = SqlQuery.new(:map_regions)
        when 'countries'
          query = SqlQuery.new(:map_countries)
        when 'projects'
          query = SqlQuery.new(:map_projects)
        else
          query = SqlQuery.new(:map_regions)
        end
        json_list = query.execute
        render json: json_list
      end
    end
  end
end
