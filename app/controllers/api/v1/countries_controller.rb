module Api::V1
  class CountriesController < ApiController
    def index
      countries = Country.all
      render json: countries, each_serializer: CountryArraySerializer
    end
  end
end
