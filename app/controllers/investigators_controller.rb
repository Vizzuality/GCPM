class InvestigatorsController < ApplicationController
  before_action :set_investigator, except: :index
  before_action :set_user,          only: [:remove_relation, :relation_request]

  respond_to :html, :js

  def index
  end

  def show
    @page = params.key?(:page) && params[:page] ? params[:page].to_i : 1
    @filters = %w(projects posts)
    @current_type = params.key?(:data) ? params[:data] : 'projects'

    gon.server_params = { 'investigators[]': params[:id] }

    if notice
      gon.notice = notice
    end

    limit = 12 + (@page * 9)

    @projects = Project.fetch_all(investigators: @investigator.id).order('created_at DESC')
    @posts = Post.where(user_id: @investigator.id)

    if params.key?(:data) && params[:data] == 'posts'
      @items = @posts.first(limit)
      @more = (@posts.size > @items.size)
      @items_total = @posts.size
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

    respond_with(@items)
  end

  def remove_relation
    if @investigator.remove_relation(@user.id)
      redirect_to investigator_path(@investigator), notice: { text: 'Relation removed.', show: true }
    else
      redirect_to investigator_path(@investigator), notice: { text: "Can't remove relation.", show: true }
    end
  end

  def relation_request
    if @investigator.relation_request(@user.id)
      redirect_to investigator_path(@investigator), notice: { text: 'Your request is being revised, please, check your dashboard for updates.', show: true }
    else
      redirect_to investigator_path(@investigator), notice: { text: "Can't request relation.", show: true }
    end
  end

  private

    def set_investigator
      @investigator = Investigator.find(params[:id])
    end

    def set_user
      if user_signed_in?
        @user = current_user
      else
        redirect_to investigator_url(@investigator)
      end
    end
end
