class NetworkProjectsController < ApplicationController
  before_action :authenticate_user!, except: :show
  load_and_authorize_resource class: 'Project', only: [:new, :create]

  before_action :set_user,         only: :show
  before_action :set_current_user, only: [:new, :create, :edit, :update, :destroy]
  before_action :set_project,      only: [:show, :edit, :update, :destroy]
  before_action :set_selection,    only: [:new, :create, :edit, :update]
  before_action :set_owner,        only: :show

  def show
    authorize! :show, @project
  end

  def edit
    authorize! :edit, @project
  end

  def new
    @project = Project.new
  end

  def update
    authorize! :update, @project
    if @project.update(project_params)
      redirect_to project_path(@project.slug_or_id), notice: 'Project succesfully updated.'
    else
      render :edit, notice: "Project can't be updated."
    end
  end

  def create
    @project = @user.projects.build(project_params)
    if @project.save
      redirect_to project_path(@project.slug_or_id), notice: 'Project succesfully created.'
    else
      render :new, notice: @project.errors.full_messages
    end
  end

  def destroy
    authorize! :destroy, @project
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
      @owner = user_signed_in? && @user.projects.include?(@project)
    end

    def set_current_user
      @user = if current_user.admin?
                User.find(params[:user_id])
              else
                current_user
              end
    end

    def set_project
      @project = Project.set_by_id_or_slug(params[:id])
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
