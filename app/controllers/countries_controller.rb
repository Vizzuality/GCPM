class CountriesController < ApplicationController
  before_action :set_country, only: :show

  def index
  end

  def show
    @filters = %w(projects events)
    @limit = 15
    @projects      = Project.fetch_all(countries: @country.id).order('created_at DESC').limit(params[:limit] ? params[:limit].to_i * @limit : @limit)
    @projectsCount = Project.fetch_all(countries: @country.id).length
    @events = Event.fetch_all(countries: @country.id).order('created_at DESC').limit(params[:limit] ? params[:limit].to_i * @limit : @limit)
    @eventsCount = Event.fetch_all(countries: @country.id).length

    @current_type = params[:data] || 'projects'

    # @organizations  = Organization.fetch_all(countries: @country.id).order('created_at DESC').limit(params[:limit] ? params[:limit].to_i * @limit : @limit)
    # @organizationsCount = @organizations.length
  end

  private

    def set_country
      @country = Country.find_by(country_iso_3: params[:iso])
    end
end
