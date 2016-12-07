module Api::V1
  class ProjectsController < ApiController
    include ApiAuthenticable
    skip_before_action :set_user_by_token, only: :index

    before_action :set_user_project, only: [:show, :update]

    def index
      @projects = Project.fetch_all(filter_params)
      render json: @projects, each_serializer: ProjectArraySerializer
    end

    def show
      render json: @project, include: ['funding_sources',
                                       'cancer_types',
                                       'specialities',
                                       'project_types',
                                       'users',
                                       'memberships',
                                       'memberships.investigator',
                                       'memberships.organization',
                                       'memberships.address'], status: 200, serializer: ProjectSerializer
    end

    def update
      if Project.update_project(project_params, @project)
        render json: @project, include: ['funding_sources',
                                         'cancer_types',
                                         'specialities',
                                         'project_types',
                                         'users',
                                         'memberships',
                                         'memberships.investigator',
                                         'memberships.organization',
                                         'memberships.address'], status: 200, serializer: ProjectSerializer
      else
        render json: { success: false, message: @project.errors.full_messages }, status: 422
      end
    end

    def create
      @project = Project.build_project(project_params.merge(users: [@user], created_by: @user.id))
      if @project.save
        render json: @project, include: ['funding_sources',
                                         'cancer_types',
                                         'specialities',
                                         'project_types',
                                         'users',
                                         'memberships',
                                         'memberships.investigator',
                                         'memberships.organization',
                                         'memberships.address'], status: 201, serializer: ProjectSerializer
      else
        render json: { success: false, message: @project.errors.full_messages }, status: 422
      end
    end

    private

      def filter_params
        params.permit(:countries, :regions, :investigators, :project_types,
                      :cancer_types, :specialities, :organizations,
                      :organization_types, :start_date, :end_date,
                      :user, :limit, :offset)
      end

      def set_user_project
        @project = Project.set_by_id_or_slug(params[:id])

        if @user.projects.include?(@project)
          return
        else
          render json: { success: false, message: "You don't have permission to access this project" }, status: 401
        end
      end

      def project_params
        params.require(:project).permit!
      end
  end
end
