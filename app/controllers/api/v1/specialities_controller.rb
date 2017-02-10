module Api
  module V1
    class SpecialitiesController < ApiController
      def index
        specialities = Speciality.all.select(:id, :name)
        render json: specialities
      end
    end
  end
end
