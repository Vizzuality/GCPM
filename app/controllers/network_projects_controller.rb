class NetworkProjectsController < ApplicationController
  def index
    @user = User.find(params[:project_id])
    @projects = @user.projects
  end

  def show
    @user = User.find(params[:project_id])
    @project = @user.projects.find(params[:project_id])
  end

  def new
    @project = Project.new
  end

  def create
    @project = Project.new(project_params)
    @project.user = current_user
    if @project.save
      flash[:success] = "Project succesfully created"
      redirect_to @project
    else
      render 'new'
    end
  end

  def edit
    @project = current_user.projects.find(params[:project_id])
  end

  def update
    if @project.update_attributes(project_params)
      redirect_to @project
    else
      render 'edit'
    end
  end

  def delete
    if Project.delete(params[:project_id])
      flash[:success] = "Project succesfully deleted"
      redirect_to user_projects
    else
      flash[:error] = "There was an error and project can't be deleted"
      redirect_to user_projects
    end
  end

  private

    def project_params
      params.require(:project).permit()
    end
end
