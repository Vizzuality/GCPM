module Api::V1
  class OrganizationsController < ApiController
    before_action :set_organization, except: [:index, :index_countries]

    def index
      # ToDo: implementation of organization search by name
      organizations = Organization.fetch_all(organizations_params)
      render json: organizations, each_serializer: OrganizationArraySerializer
    end

    def show
      render json: @organization, serializer: OrganizationSerializer
    end

    def index_countries
      countries = Country.all
      render json: countries, each_serializer: OrganizationArraySerializer
    end

    private

      def set_organization
        @organization = Organization.set_by_id_or_slug(params[:id])
      end

      def organization_params
        params.require(:organization).permit!
      end

      def organizations_params
        params.permit(:funding_source, :active, :q)
      end
  end
end
