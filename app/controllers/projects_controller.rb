class ProjectsController < ApplicationController
  def show
    @project = Project.find(params[:id])
    gon.server_params = { }
    gon.api_location_path = "/api/map/projects/#{params[:id]}"
  end
end
