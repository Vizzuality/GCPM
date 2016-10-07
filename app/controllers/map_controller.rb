class MapController < ApplicationController

  respond_to :html, :js

  def index
    params = request.query_parameters

    @page = params.key?(:page) && params[:page] ? params[:page].to_i : 1
    @filters = %w(projects events)
    @current_type = params.key?(:data) ? params[:data] : 'projects'

    limit = 12 + (@page * 9)

    if params.key?(:data) && params[:data] == 'events'
      events = Event.fetch_all(projects_params).order(sort_param)
      @items = events.limit(limit)
      @more = (events.size > @items.size)
      @items_total = events.size
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
      params.permit(:sortby, :user, :start_date, :end_date, regions:[], countries:[], project_types:[], cancer_types:[], organization_types:[], organizations:[], investigators:[])
    end

    def investigators_params
      params.permit(:data, :sortby, :start_date, :end_date, regions:[], countries:[], project_types:[], cancer_types:[], organization_types:[], organizations:[])
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
      else
        @sortby = 'title ASC'
      end
    end
end
