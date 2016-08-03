class ProjectsController < ApplicationController
  def show
    @project = Project.find(params[:id])
    @current_type = params[:type] || 'project-info'
  end
end
