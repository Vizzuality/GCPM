class NetworkProjectsController < ApplicationController
  before_action :authenticate_user!, except: :show

  before_action :set_user,         only: :show
  before_action :set_current_user, only: [:new, :create, :edit, :update, :destroy]
  before_action :set_project,      only: [:show, :edit, :update, :destroy]
  before_action :set_selection,    only: [:new, :create, :edit, :update]
  before_action :set_owner,        only: :show

  def show
  end

  def edit
  end

  def new
    @project = Project.new
  end

  def update
    if @project.update(project_params)
      redirect_to project_path(@project), notice: 'Project succesfully updated.'
    else
      render :edit, notice: "Project can't be updated."
    end
  end

  def create
    @project = @user.projects.build(project_params)
    if @project.save
      redirect_to edit_user_project_path(@user, @project, anchor: 'relations', relations: true), notice: 'Project succesfully created.'
    else
      render :new, notice: @project.errors.full_messages
    end
  end

  def destroy
    if @project.destroy
      redirect_to user_path(@user), notice: 'Project succesfully deleted.'
    else
      redirect_to user_path(@user), notice: "There was an error and project can't be deleted."
    end
  end

  private

    def set_user
      @user = User.find(params[:user_id])
    end

    def set_owner
      @owner = user_signed_in? && current_user.projects.include?(@project)
    end

    def set_current_user
      @user = current_user
    end

    def set_project
      @project = @user.projects.find(params[:id])
    end

    def set_selection
      # Improvements move selection to autocomplete search
      @countries     = Country.all.map      { |c| [c.country_name, c.id] }
      @project_types = ProjectType.all.map  { |p| [p.name, p.id]         }
      @cancer_types  = CancerType.all.map   { |c| [c.name, c.id]         }
      @funders       = Organization.all.map { |f| [f.name, f.id]         }
    end

    def project_params
      params.require(:project).permit!
    end
end
