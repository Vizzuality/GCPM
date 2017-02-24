class MapController < ApplicationController

  respond_to :html, :js

  def index
    params = request.query_parameters

    @page = params.key?(:page) && params[:page] ? params[:page].to_i : 1
    @filters = %w(projects people events)
    @current_type = params.key?(:data) ? params[:data] : 'projects'

    gon.server_params = { 'user': current_user ? current_user.id : '' }
    gon.isMobile = browser.device.mobile?

    limit = 12 + (@page * 9)

    if params.key?(:data) && params[:data] == 'events'
      events = Event.fetch_all(events_params)
      # Get public and private events
      public , private = [], []
      events.each do |event|
        public << event if event.private == false
        private << event if event.private == true
      end
      @items = events.limit(limit)
      @more = (events.size > @items.size)
      @items_public_total = public.size
      @items_private_total = private.size
      @items_total = events.size
    elsif params.key?(:data) && params[:data] == 'people'
      people = Investigator.fetch_all(people_params)
      @items = people.limit(limit)
      @more = (people.size > @items.size)
      @items_total = people.size
    else
      projects = Project.fetch_all(projects_params).order(sort_param)
      @items = projects.limit(limit)
      @project_leads = SqlQuery.new("investigators_count", params: investigators_params.merge!(membership_type: 0)).execute[0]["count"]
      @collaborators = SqlQuery.new("investigators_count", params: investigators_params.merge!(membership_type: 1)).execute[0]["count"]
      detail = params[:detail] && ['countries', 'regions', 'points'].include?(params[:detail]) ? params[:detail] : 'points'
      @investigations = SqlQuery.new("count_investigations_#{detail}", params: investigators_params).execute[0]["total"]
      @more = (projects.size > @items.size)
      @items_total = projects.size
    end

    respond_with(@items)
  end

  private

    def projects_params
      params.permit(:sortby, :user, :start_date, :end_date, regions:[], countries:[], project_types:[], cancer_types:[], organization_types:[], organizations:[], investigators:[], funding_sources:[], specialities:[])
    end

    def events_params
      params.permit(:user, :sortby, :start_date, :end_date, regions:[], countries:[], project_types:[], cancer_types:[], organization_types:[], organizations:[], investigators:[], funding_sources:[], specialities:[])
    end

    def investigators_params
      params.permit(:data, :sortby, :start_date, :end_date, regions:[], countries:[], project_types:[], cancer_types:[], organization_types:[], organizations:[], funding_sources:[], specialities:[])
    end

    def people_params
      params.permit(:data, :sortby, :start_date, :end_date, regions:[], countries:[], project_types:[], cancer_types:[], organization_types:[], organizations:[], funding_sources:[], specialities:[])
    end

    def sort_param
      case params[:sortby]
      when 'title_asc'
        @sortby = 'title ASC'
      when 'title_desc'
        @sortby = 'title DESC'
      when 'created_asc'
        @sortby = 'created_at ASC'
      when 'created_desc'
        @sortby = 'created_at DESC'
      when 'start_date_asc'
        @sortby = 'start_date ASC NULLS LAST'
      when 'start_date_desc'
        @sortby = 'start_date DESC NULLS LAST'
      else
        @sortby = 'title ASC'
      end
    end
end
