class MapController < ApplicationController

  respond_to :html, :js

  def index
    params = request.query_parameters
    page = params.key?(:page) && params[:page] ? params[:page].to_i : 1
    limit = 12 + (page * 9)

    @title = t 'map'
    @filters = %w(projects events)
    @current_type = params.key?(:data) ? params[:data] : 'projects'
    @user_data = current_user.present? ? JSON.generate(build_user_data) : nil

    if params.key?(:data) && params[:data] == 'events'
      events = Event.fetch_all(projects_params).order('created_at DESC')
      @items = events.limit(limit)
      @more = (events.size > @items.size)
    else
      projects = Project.fetch_all(projects_params).order('created_at DESC')
      @items = projects.limit(limit)
      @more = (projects.size > @items.size)
    end

    respond_with(@items)
  end

  private

    def projects_params
      params.permit(:sortby, :user, :start_date, :end_date, :region, :country, project_types:[], cancer_types:[], organization_types:[], organizations:[], investigators:[])
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
