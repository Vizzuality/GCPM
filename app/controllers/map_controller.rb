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
    @user_data = current_user.present? ? JSON.generate(build_user_data) : nil
    respond_with(@projects)

  end

  private

    def projects_params
      params.permit(:sortby, :user, :start_date, :end_date, project_types:[], countries:[], cancer_types:[], organization_types:[], organizations:[], regions:[], investigators:[])
    end

    def build_user_data
      if current_user.name && current_user.email
        user_initial = current_user.email[0].upcase
      else
        user_initial = 'U'
      end
      {
        user_project: Project.where("user_id = #{current_user.id}").count,
        user_event: Event.where("user_id = #{current_user.id}").count,
        user_initial: user_initial
      }
    end
end
