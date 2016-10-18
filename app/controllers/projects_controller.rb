class ProjectsController < ApplicationController
  respond_to :html, :js

  def show
    @project = Project.find(params[:id])
    gon.server_params = { }
    gon.api_location_path = "/api/map/projects/#{params[:id]}"
    gon.start_date = @project.start_date || 0
    gon.end_date = @project.end_date || 0
    @filters = %w(info)
    @current_type = params.key?(:data) ? params[:data] : 'info'

    if current_user
      @followed = current_user.following?(@project)
      @followed_id = @project.id
      @followed_resource = 'Project'
    end

    respond_with(@project)
  end
end
