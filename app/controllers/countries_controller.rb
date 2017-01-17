class CountriesController < ApplicationController
  before_action :set_country, only: :show
  respond_to :html, :js

  def index
  end

  def show
    @page = params.key?(:page) && params[:page] ? params[:page].to_i : 1
    @filters = %w(data projects people events posts)
    @current_type = params.key?(:data) ? params[:data] : 'data'

    gon.server_params = { 'countries[]': params[:iso] }
    gon.carto_account = ENV["CARTODB_ACCOUNT"]
    gon.carto_key = ENV["CARTODB_KEY"]
    gon.isMobile = browser.device.mobile?

    limit = 12 + (@page * 9)

    @events = Event.fetch_all(countries: params[:iso]).distinct.order('start_date DESC NULLS LAST')
    @projects = Project.fetch_all(countries: params[:iso]).distinct.order('created_at DESC')
    @people = Investigator.fetch_all(countries: params[:iso]).distinct.order('created_at DESC')
    @posts = @country.posts

    if params.key?(:data) && params[:data] == 'events'
      @items = @events.limit(limit)
      @more = (@events.size > @items.size)
      @items_total = @events.size
    elsif params.key?(:data) && params[:data] == 'people'
      @items = @people.limit(limit)
      @more = (@people.size > @items.size)
      @items_total = @people.size
    elsif params.key?(:data) && params[:data] == 'posts'
      @items = @posts.limit(limit)
      @more = (@posts.size > @items.size)
      @items_total = @posts.size
    else
      @items = @projects.limit(limit)
      @more = (@projects.size > @items.size)
      @items_total = @projects.size
    end

    if current_user
      @followed = current_user.following?(@country)
      @followed_id = @country.id
      @followed_resource = 'Country'
    end

    respond_with(@items)
  end

  private

    def set_country
      @country = Country.find_by(country_iso_3: params[:iso])
    end

    def countries_params
      params.permit(:data, :regions[], :countries[])
    end
end
