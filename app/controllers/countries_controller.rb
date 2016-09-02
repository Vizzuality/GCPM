class CountriesController < ApplicationController
  before_action :set_country, only: :show

  def index
    @title = t 'countries'
  end

  def show
    @projects      = Project.fetch_all(countries: @country.id)
    @projectsCount = @projects.length
    @limit = 15
  end

  private
    
    def set_country
      @country = Country.find_by(country_iso: params[:iso])
    end
end
