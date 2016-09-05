class CountriesController < ApplicationController
  before_action :set_country, only: :show

  def index
    @title = t 'countries'
  end

  def show
    @limit = 15
    @projects      = Project.fetch_all(countries: @country.id).order('created_at DESC').limit(params[:limit] ? params[:limit].to_i * @limit : @limit)
    @projectsCount = @projects.length
    @events = Event.fetch_all(countries: @country.id).order('created_at DESC').limit(params[:limit] ? params[:limit].to_i * @limit : @limit)
    @eventsCount = @events.length

    # @organizations  = Organization.fetch_all(countries: @country.id).order('created_at DESC').limit(params[:limit] ? params[:limit].to_i * @limit : @limit)
    # @organizationsCount = @organizations.length
  end

  private

    def set_country
      @country = Country.find_by(country_iso: params[:iso])
    end
end
