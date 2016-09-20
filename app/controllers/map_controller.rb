class MapController < ApplicationController

  respond_to :html, :js

  def index
    @title = t 'map'
    @params = request.query_parameters

    # Common vars
    @countries = Country.order('country_name')
    @organizations = Organization.order('name')
    @organization_types = OrganizationType.all
    @cancer_types = CancerType.order('name')
    @project_types = ProjectType.order('name')
    @investigators = Investigator.order('name')

    @limit = 15
    # Projects
    #Limit of projects shown at the beginning and added when show more button clicked
    @projects  = Project.fetch_all(projects_params).order('created_at DESC').limit(@limit).offset(params[:limit] ? params[:limit].to_i : @limit)
    @projectsCount = Project.count

    # Events
    #Limit of events shown at the beginning and added when show more button clicked
    @events  = Event.fetch_all(projects_params).order('created_at DESC').limit(@limit).offset(params[:limit] ? params[:limit].to_i : @limit)
    @eventsCount = Event.count

    @current_type = params[:data] || 'projects'
    @filters = ['projects', 'events']

    respond_with(@projects)
  end

  private
  def projects_params
    params.permit(:sortby, :user, :start_date, :end_date, project_types:[], countries:[], cancer_types:[], organization_types:[], organizations:[], regions:[], investigators:[])
  end

end
