class ProjectsController < ApplicationController
  respond_to :html, :js

  def show
    @project = Project.find(params[:id])
    gon.server_params = { }
    gon.api_location_path = "/api/map/projects/#{params[:id]}"
    @filters = %w(info)
    @current_type = params.key?(:data) ? params[:data] : 'info'

    respond_with(@project)
  end
end
