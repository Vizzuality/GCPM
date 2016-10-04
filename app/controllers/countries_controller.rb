class CountriesController < ApplicationController
  before_action :set_country, only: :show

  respond_to :html, :js

  def index
  end

  def show
    @page = params.key?(:page) && params[:page] ? params[:page].to_i : 1
    @title = t 'map'
    @filters = %w(projects events)
    @current_type = params.key?(:data) ? params[:data] : 'projects'

    limit = 12 + (@page * 9)

    if params.key?(:data) && params[:data] == 'events'
      events = Event.fetch_all(countries: @country.id).order('created_at DESC')
      @items = events.limit(limit)
      @more = (events.size > @items.size)
      @items_total = events.size
    else
      projects = Project.fetch_all(countries: @country.id).order('created_at DESC')
      @items = projects.limit(limit)
      @more = (projects.size > @items.size)
      @items_total = projects.size
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
