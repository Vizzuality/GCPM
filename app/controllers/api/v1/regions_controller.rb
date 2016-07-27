module Api
  module V1
    class RegionsController < ApiController
      def index
        countries = Country.select(:region_name, :region_iso, :region_centroid).uniq.order('region_name')
        render json: countries, each_serializer: RegionsSerializer
      end
    end
  end
end
