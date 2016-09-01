class CountriesController < ApplicationController
  def index
    @title = t 'countries'
  end

  def show
    @country  = Country.find_by(country_iso: params[:iso])
    @projects  = Project.fetch_all(projects_params).order('created_at DESC').limit(params[:limit] ? params[:limit].to_i * @limit : @limit)
    @projectsCount = Project.count
    @limit = 15
  end
  private
  def projects_params
    params.permit(:sortby, :user, :start_date, :end_date, project_types:[], countries:[], cancer_types:[], organization_types:[], organizations:[], regions:[], investigators:[])
  end
end
