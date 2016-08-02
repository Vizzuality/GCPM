class MapController < ApplicationController

  def index
    @title = t 'map'
    @params = request.query_parameters

    # Common vars
    @countries = Country.all.order('country_name')
    @organizations = Organization.all.order('name')
    @organization_types = OrganizationType.all
    @cancer_types = CancerType.all.order('name')
    @project_types = ProjectType.all.order('name')

    # Projects
    #Limit of projects shown at the begenning and added when show more button clicked
    @limit = 15
    @projects  = Project.all.order('created_at DESC').limit(params[:limit] ? params[:limit].to_i * @limit : @limit)

    @current_type = params[:type] || 'projects'
    @filters = ['projects', 'people', 'events']

    respond_to do |format|
      format.html
      format.js
    end
  end

end
