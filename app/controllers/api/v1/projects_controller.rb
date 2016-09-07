module Api::V1
  class ProjectsController < ApiController
    include ApiAuthenticable

    before_action :set_user_by_token, only: [:update, :create]
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

      def set_user_by_token
        if params[:token].present?
          @user = User.find_by(authentication_token: params[:token])
          if @user.blank?
            render json: { success: false, message: 'Please login again' }, status: 422
          elsif @user && session_invalid?(@user)
            reset_auth_token(@user)
          else
            return
          end
        else
          render json: { success: false, message: 'Please provide authentication token' }, status: 422
        end
      end

      def set_user_project
        @project = @user.projects.find(params[:id])
      end

      def project_params
        params.require(:project).permit!
      end
  end
end
