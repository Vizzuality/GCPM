module Api::V1
  class ProjectTypesController < ApiController
    def index
      project_types = ProjectType.select_id_name
      render json: project_types
    end
  end
end
