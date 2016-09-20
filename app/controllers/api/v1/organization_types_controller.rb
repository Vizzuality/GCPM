module Api
  module V1
    class OrganizationTypesController < ApiController
      def index
        organization_types = OrganizationType.all.select(:id, :name)
        render json: organization_types
      end
    end
  end
end
