class OrganizationsController < ApplicationController
  before_action :set_organization, only: :show

  respond_to :html, :js

  def index
  end

  def show
    @page = params.key?(:page) && params[:page] ? params[:page].to_i : 1
    @filters = %w(projects)
    @current_type = params.key?(:data) ? params[:data] : 'projects'

    gon.server_params = { 'organizations[]': params[:id] }

    limit = 12 + (@page * 9)

    @events = Event.fetch_all(organizations: @organization.id).order('created_at DESC')
    @projects = Project.fetch_all(organizations: @organization.id).order('created_at DESC')
    @people = Investigator.fetch_all(organizations: @organization.id).order('created_at DESC')

    if params.key?(:data) && params[:data] == 'events'
      @items = @events.limit(limit)
      @more = (@events.size > @items.size)
      @items_total = @events.size
    elsif params.key?(:data) && params[:data] == 'people'
      @items = @people.limit(limit)
      @more = (@people.size > @items.size)
      @items_total = @people.size
    else
      @items = @projects.limit(limit)
      @more = (@projects.size > @items.size)
      @items_total = @projects.size
    end

    respond_with(@items)
  end

  private

    def set_organization
      @organization = Organization.find_by(id: params[:id])
    end
end
