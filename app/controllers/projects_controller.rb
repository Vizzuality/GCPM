class ProjectsController < ApplicationController
  before_action :set_project
  before_action :set_user, only: [:remove_relation, :relation_request]

  respond_to :html, :js

  def show
    authorize! :show, @project
    gon.server_params = {}
    gon.api_location_path = "/api/map/projects/#{@project.id}"
    gon.start_date = @project.start_date || 0
    gon.end_date = @project.end_date || 0
    gon.isMobile = browser.device.mobile?

    if notice
      gon.notice = notice
    end

    @filters = %w(info people posts)
    @current_type = params.key?(:data) ? params[:data] : 'info'
    @page = params.key?(:page) && params[:page] ? params[:page].to_i : 1
    limit = 12 + (@page * 9)

    @people = @project.investigators.distinct
    @organizations = @project.organizations.distinct
    @addresses = @project.addresses.distinct.map{|a| [a.city, a.country_name, a.country_code]}.uniq
    @posts = @project.posts

    if params.key?(:data) && params[:data] == 'people'
      @items = @people.first(limit)
      @more = (@people.size > @items.size)
      @items_total = @people.size
    elsif params.key?(:data) && params[:data] == 'posts'
      @items = @posts.first(limit)
      @more = (@posts.size > @items.size)
      @items_total = @posts.size
    end

    if current_user
      @followed = current_user.following?(@project)
      @followed_id = @project.id
      @followed_resource = 'Project'
    end

    @updates = ProjectUpdate.where(project_id: @project.id)

    # size: Results size (standard 12),
    # level: Level to search for related projects:
    # standard [1,2,3,4]: cancer_types = 1 + project_types = 2 + specialities = 3 + countries = 4
    # strict true - false
    # @project.related(size: 9, level: [1,2,3], strict: true)
    @related_projects = @project.related(size: 9, level: [1,2,3,4], strict: false)

    respond_with(@items)
  end

  def remove_relation
    authorize! :remove_relation, @project
    if @project.remove_relation(@user.id)
      UserMailer.user_relation_email(@user.name, @user.email, @project.title, 'removed', 'Project').deliver_later
      redirect_to project_url(@project), notice: { text: 'Relation removed.', show: true }
    else
      redirect_to project_url(@project), notice: { text: "Can't remove relation.", show: true }
    end
  end

  def relation_request
    authorize! :relation_request, @project
    if @project.relation_request(@user.id)
      UserMailer.user_relation_email(@user.name, @user.email, @project.title, 'request', 'Project').deliver_later
      AdminMailer.user_relation_email('project', @project.title, 'request').deliver_later
      redirect_to project_url(@project), notice: { text: 'Your request is being reviewed, please, check your dashboard for updates.', show: true }
    else
      redirect_to project_url(@project), notice: { text: "Can't request relation.", show: true }
    end
  end

  private

    def set_project
      @project = Project.preload(:organizations).set_by_id_or_slug(params[:id])
    end

    def set_user
      if user_signed_in?
        @user = current_user
      else
        redirect_to project_url(@project)
      end
    end
end
