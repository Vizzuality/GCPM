module Api::V1
  class ProjectsController < ApiController
    include ApiAuthenticable

    before_action :set_user_project, only: [:show, :update]

    def show
      render json: @project, include: ['funding_sources',
                                       'cancer_types',
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
      @project = Project.build_project(project_params.merge(users: [@user]))
      if @project.save
        render json: @project, include: ['funding_sources',
                                         'cancer_types',
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

      def set_user_project
        @project = Project.find(params[:id])

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
