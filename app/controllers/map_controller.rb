class MapController < ApplicationController

  respond_to :html, :js

  def index
    params = request.query_parameters

    @page = params.key?(:page) && params[:page] ? params[:page].to_i : 1
    @filters = %w(projects events)
    @current_type = params.key?(:data) ? params[:data] : 'projects'

    limit = 12 + (@page * 9)

    if params.key?(:data) && params[:data] == 'events'
      events = Event.fetch_all(projects_params).order('created_at DESC')
      @items = events.limit(limit)
      @more = (events.size > @items.size)
      @items_total = events.size
    else
      projects = Project.fetch_all(projects_params).order('created_at DESC')
      @items = projects.limit(limit)
      @project_leads = Investigator.joins(projects: :memberships).fetch_all(investigators_params).where('memberships.membership_type = 0').count
      @collaborators = Investigator.joins(projects: :memberships).fetch_all(investigators_params).where('memberships.membership_type = 1').count
      @more = (projects.size > @items.size)
      @items_total = projects.size
    end

    respond_with(@items)
  end

  private

    def projects_params
      params.permit(:data, :sortby, :start_date, :end_date, :region, :country, project_types:[], cancer_types:[], organization_types:[], organizations:[], investigators:[])
    end

    def investigators_params
      params.permit(:data, :sortby, :start_date, :end_date, :region, :country, project_types:[], cancer_types:[], organization_types:[], organizations:[])
    end
end
