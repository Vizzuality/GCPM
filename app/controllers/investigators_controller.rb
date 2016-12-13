class InvestigatorsController < ApplicationController
  before_action :set_investigator, except: :index
  before_action :set_user,         only: [:remove_relation, :relation_request]

  respond_to :html, :js

  def index
  end

  def show
    authorize! :show, @investigator
    @investigator_user = @investigator.user
    @page = params.key?(:page) && params[:page] ? params[:page].to_i : 1
    @filters = @investigator_user.present? ? %w(data projects posts network) : %w(data projects posts)
    @current_type = params.key?(:data) ? params[:data] : 'data'

    gon.server_params = { 'investigators[]': @investigator.id, name: @investigator.name }
    gon.isMobile = browser.device.mobile?

    if gon.isMobile
      @filters.delete('data')
      @current_type == 'data' && @current_type = 'projects'
    end

    if notice
      gon.notice = notice
    end

    limit = 12 + (@page * 9)

    @projects = Project.fetch_all(investigators: @investigator.id).order('created_at DESC')
    @posts = Post.where(user_id: @investigator.id)
    @events = Event.fetch_all(user: @investigator_user && @investigator_user.id || -1).order('created_at DESC')

    if params.key?(:data) && params[:data] == 'posts'
      @items = @posts.first(limit)
      @more = (@posts.size > @items.size)
      @items_total = @posts.size
    elsif params.key?(:data) && params[:data] == 'network'
      @followProjects = @investigator_user.following_by_type('Project')
      @followEvents = @investigator_user.following_by_type('Event')
      @followPeople = @investigator_user.following_by_type('Investigator')
      @followUser = @investigator_user.following_by_type('User')
      @followCancerTypes = @investigator_user.following_by_type('CancerType')
      @followCountries = @investigator_user.following_by_type('Country')
    elsif params.key?(:data) && params[:data] == 'events'
      @items = @events.limit(limit)
      @more = (@events.size > @items.size)
      @items_total = @events.size
    else
      @items = @projects.limit(limit)
      @more = (@projects.size > @items.size)
      @items_total = @projects.size
    end

    if current_user
      @followed = current_user.following?(@investigator)
      @followed_id = @investigator.id
      @followed_resource = 'Investigator'
    end

    @following = @investigator_user && @investigator_user.follow_count || 0
    @followers = @investigator_user && @investigator.followers_count || 0

    respond_with(@items)
  end

  def remove_relation
    authorize! :remove_relation, @investigator
    if @investigator.remove_relation(@user.id)
      UserMailer.user_relation_email(@user.name, @user.email, @investigator.name, 'removed').deliver_later
      redirect_to investigator_path(@investigator), notice: { text: 'Relation removed.', show: true }
    else
      redirect_to investigator_path(@investigator), notice: { text: "Can't remove relation.", show: true }
    end
  end

  def relation_request
    authorize! :relation_request, @investigator
    if @investigator.relation_request(@user.id)
      UserMailer.user_relation_email(@user.name, @user.email, @investigator.name, 'request').deliver_later
      AdminMailer.user_relation_email('investigator', @investigator.name, 'request').deliver_later
      redirect_to investigator_path(@investigator), notice: { text: 'Your request is being reviewed, please, check your dashboard for updates.', show: true }
    else
      redirect_to investigator_path(@investigator), notice: { text: "Can't request relation.", show: true }
    end
  end

  private

    def set_investigator
      @investigator = Investigator.set_by_id_or_slug(params[:id])
    end

    def set_user
      if user_signed_in?
        @user = current_user
      else
        redirect_to investigator_url(@investigator)
      end
    end
end
