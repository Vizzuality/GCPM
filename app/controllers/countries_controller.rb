class CountriesController < ApplicationController
  before_action :set_country, only: :show

  respond_to :html, :js

  def index
  end

  def show
    @page = params.key?(:page) && params[:page] ? params[:page].to_i : 1
    @filters = %w(projects people events)
    @current_type = params.key?(:data) ? params[:data] : 'projects'

    gon.server_params = { 'countries[]': params[:iso] }

    limit = 12 + (@page * 9)

    @events = Event.fetch_all(country: params[:iso]).order('created_at DESC')
    @projects = Project.fetch_all(country: params[:iso]).order('created_at DESC')
    @people = Investigator.fetch_all(country: params[:iso]).order('created_at DESC')

    if params.key?(:data) && params[:data] == 'events'
      @items = @events.limit(limit)
      @more = (@events.size > @items.size)
      @items_total = @events.size
    elsif params.key?(:data) && params[:data] == 'people'
      @items = @people.limit(limit)
      @more = (@people.size > @items.size)
      @items_total = @people.size
    else
      @items = @projects.limit(limit)
      @more = (@projects.size > @items.size)
      @items_total = @projects.size
    end

    respond_with(@items)
  end

  private

    def set_country
      @country = Country.find_by(country_iso_3: params[:iso])
    end

    def countries_params
      params.permit(:data, :region, :country)
    end
end
