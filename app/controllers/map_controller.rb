class MapController < ApplicationController

  respond_to :html, :js

  def index
    params = request.query_parameters
    page = params.key?(:page) && params[:page] ? params[:page].to_i : 1
    limit = 10 + (page * 10)

    @title = t 'map'
    @filters = %w(projects events)
    @current_type = params.key?(:data) ? params[:data] : 'projects'
    @user_data = current_user.present? ? JSON.generate(build_user_data) : nil

    if params.key?(:data) && params[:data] == 'events'
      @items = Event.fetch_all(projects_params).order('created_at DESC').limit(limit)
    else
      @items = Project.fetch_all(projects_params).order('created_at DESC').limit(limit)
    end

    respond_with(@items)
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
