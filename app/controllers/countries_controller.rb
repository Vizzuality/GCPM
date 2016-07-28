class CountriesController < ApplicationController
  def index
    @title = t 'countries'
  end

  def show
    @country  = Country.find_by(country_iso: params[:iso])
  end
end
