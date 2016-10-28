class UsersController < ApplicationController
  before_action :set_user

  respond_to :html, :js

  def show
    # @projects = user_signed_in? && @user == current_user ? @user.projects.includes(:cancer_types).limit(params[:limit] ?
    #   params[:limit].to_i * @limit : @limit) :
    #   @user.published_projects.limit(params[:limit] ? params[:limit].to_i * @limit : @limit)
    # @isProfile = true

    if !current_user
      redirect_to new_user_session_path and return
    elsif current_user != User.find_by_id(params[:id])
      redirect_to map_path and return
    end

    @page = params.key?(:page) && params[:page] ? params[:page].to_i : 1
    @filters = %w(network projects posts)
    @current_type = params.key?(:data) ? params[:data] : 'projects'

    # gon.server_params = { 'investigators[]': @investigator.size.positive? ? @investigator.first.id : '0' }

    limit = 12 + (@page * 9)

    @projects = @user.projects
    @people = Investigator.fetch_all(user: params[:id]).uniq.order('created_at DESC')
    @posts = Post.where(user_id: current_user.id)

    if params.key?(:data) && params[:data] == 'network'
      @items = @people.limit(limit)
      @more = (@people.size > @items.size)
      @items_total = @people.size
    elsif params.key?(:data) && params[:data] == 'posts'
      @items = @posts.first(limit)
      @more = (@posts.size > @items.size)
      @items_total = @posts.size
    else
      @items = @projects.limit(limit)
      @more = (@projects.size > @items.size)
      @items_total = @projects.size
    end

    @following = @user.follow_count || 0
    @followers = 0

    respond_with(@items)
  end

  private

    def set_user
      @user = User.find(params[:id])
      @investigator = Investigator.fetch_all(user: params[:id]);
    end
end
