module Api::V1
  class ProjectsController < ApiController
    include ApiAuthenticable

    before_action :set_user_project,  only: :update

    def update
      if Project.update_project(project_params, @project)
        render json: @project, status: 200, serializer: ProjectSerializer
      else
        render json: { success: false, message: @project.errors.full_messages }, status: 422
      end
    end

    def create
      @project = Project.build_project(project_params.merge(user: @user))
      if @project.save
        render json: @project, status: 201, serializer: ProjectSerializer
      else
        render json: { success: false, message: @project.errors.full_messages }, status: 422
      end
    end

    private

      def set_user_project
        @project = @user.projects.find(params[:id])
      end

      def project_params
        params.require(:project).permit!
      end
  end
end
