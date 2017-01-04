class SpecialitiesController < ApplicationController
  before_action :set_speciality
  respond_to :html, :js

  def show
    @page = params.key?(:page) && params[:page] ? params[:page].to_i : 1
    @title = t 'map'

    @filters = %w(projects people)
    @current_type = params.key?(:data) ? params[:data] : 'projects'

    gon.server_params = { 'specialities[]': @speciality.id }
    gon.carto_account = ENV["CARTODB_ACCOUNT"]
    gon.carto_key = ENV["CARTODB_KEY"]
    gon.isMobile = browser.device.mobile?

    limit = 12 + (@page * 9)

    @projects = Project.fetch_all(specialities: @speciality.id).order('created_at DESC')
    @people = Investigator.fetch_all(specialities: @speciality.id).order('created_at DESC')

    if params.key?(:data) && params[:data] == 'people'
      @items = @people.limit(limit)
      @more = (@people.size > @items.size)
      @items_total = @people.size
    else
      # projects by default
      @items = @projects.limit(limit)
      @more = (@projects.size > @items.size)
      @items_total = @projects.size
    end

    respond_with(@items)
  end

  private

    def set_speciality
      @speciality = Speciality.set_by_id_or_slug(params[:id])
    end
end
