class UsersController < ApplicationController
  before_action :set_user

  respond_to :html, :js

  def show
    if !current_user
      redirect_to new_user_session_path and return
    elsif current_user != User.find_by(id: params[:id])
      redirect_to map_path and return
    end

    @page = params.key?(:page) && params[:page] ? params[:page].to_i : 1
    @filters = %w(network projects posts events)
    @current_type = params.key?(:data) ? params[:data] : 'projects'

    gon.server_params = { 'user': @investigator.size.positive? ? @investigator.first.id : '0' }

    limit = 12 + (@page * 9)

    @projects = @user.projects.order('created_at DESC')
    @people = Investigator.fetch_all(user: params[:id]).uniq.order('created_at DESC')
    @posts = Post.where(user_id: current_user.id)
    @events = Event.fetch_all(user: params[:id]).uniq.order('created_at DESC')

    if params.key?(:data) && params[:data] == 'network'
      @followProjects = @user.following_by_type('Project')
      @followEvents = @user.following_by_type('Event')
      @followPeople = @user.following_by_type('Investigator')
      @followCancerTypes = @user.following_by_type('CancerType')
      @followCountries = @user.following_by_type('Country')
    elsif params.key?(:data) && params[:data] == 'posts'
      @items = @posts.first(limit)
      @more = (@posts.size > @items.size)
      @items_total = @posts.size
    elsif params.key?(:data) && params[:data] == 'events'
      @items = @events.limit(limit)
      @more = (@events.size > @items.size)
      @items_total = @events.size
    else
      @items = @projects.limit(limit)
      @more = (@projects.size > @items.size)
      @items_total = @projects.size
    end

    @following = @user.follow_count || 0
    @followers = @user.investigator.present? ? @user.investigator.followers_count : 0

    respond_with(@items)
  end

  private

    def set_user
      @user = User.find(params[:id])
      @investigator = Investigator.fetch_all(user_id: params[:id]);
    end
end
