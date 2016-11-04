class ProjectsController < ApplicationController
  load_and_authorize_resource

  before_action :set_project
  before_action :set_user, only: [:remove_relation, :relation_request]

  respond_to :html, :js

  def show
    gon.server_params = {}
    gon.api_location_path = "/api/map/projects/#{params[:id]}"
    gon.start_date = @project.start_date || 0
    gon.end_date = @project.end_date || 0

    if notice
      gon.notice = notice
    end

    @filters = %w(info people)
    @current_type = params.key?(:data) ? params[:data] : 'info'
    @page = params.key?(:page) && params[:page] ? params[:page].to_i : 1
    limit = 12 + (@page * 9)

    @people = @project.investigators

    if params.key?(:data) && params[:data] == 'people'
      @items = @people.first(limit)
      @more = (@people.size > @items.size)
      @items_total = @people.size
    end

    if current_user
      @followed = current_user.following?(@project)
      @followed_id = @project.id
      @followed_resource = 'Project'
    end

    @updates = ProjectUpdate.where(project_id: @project.id)

    respond_with(@items)
  end

  def remove_relation
    if @project.remove_relation(@user.id)
      UserMailer.user_relation_email(@user.name, @user.email, @project.title, 'removed').deliver_later
      redirect_to project_url(@project), notice: { text: 'Relation removed.', show: true }
    else
      redirect_to project_url(@project), notice: { text: "Can't remove relation.", show: true }
    end
  end

  def relation_request
    if @project.relation_request(@user.id)
      UserMailer.user_relation_email(@user.name, @user.email, @project.title, 'request').deliver_later
      redirect_to project_url(@project), notice: { text: 'Your request is being revised, please, check your dashboard for updates.', show: true }
    else
      redirect_to project_url(@project), notice: { text: "Can't request relation.", show: true }
    end
  end

  private

    def set_project
      @project = Project.find(params[:id])
    end

    def set_user
      if user_signed_in?
        @user = current_user
      else
        redirect_to project_url(@project)
      end
    end
end
