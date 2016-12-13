class CancerTypesController < ApplicationController
  before_action :set_cancer_type, only: :show
  respond_to :html, :js

  def index
  end

  def show
    @page = params.key?(:page) && params[:page] ? params[:page].to_i : 1
    @title = t 'map'

    @filters = %w(data projects people posts)
    @current_type = params.key?(:data) ? params[:data] : 'data'

    gon.server_params = { 'cancer_types[]': @cancer_type.id }
    gon.carto_account = ENV["CARTODB_ACCOUNT"]
    gon.carto_key = ENV["CARTODB_KEY"]
    gon.isMobile = browser.device.mobile?

    limit = 12 + (@page * 9)

    @projects = Project.fetch_all(cancer_types: @cancer_type.id).order('created_at DESC')
    @people = Investigator.fetch_all(cancer_types: @cancer_type.id).order('created_at DESC')
    @posts = @cancer_type.posts

    if params.key?(:data) && params[:data] == 'people'
      @items = @people.limit(limit)
      @more = (@people.size > @items.size)
      @items_total = @people.size
    elsif params.key?(:data) && params[:data] == 'posts'
      @items = @posts.limit(limit)
      @more = (@posts.size > @items.size)
      @items_total = @posts.size
    else
      # projects by default
      @items = @projects.limit(limit)
      @more = (@projects.size > @items.size)
      @items_total = @projects.size
    end

    if current_user
      @followed = current_user.following?(@cancer_type)
      @followed_id = @cancer_type.id
      @followed_resource = 'CancerType'
    end

    respond_with(@items)
  end

  private

    def set_cancer_type
      @cancer_type = CancerType.set_by_id_or_slug(params[:id])
    end
end
