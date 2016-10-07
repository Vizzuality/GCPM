class ProjectsController < ApplicationController
  def show
    @project = Project.find(params[:id])
    gon.server_params = { }
  end
end
