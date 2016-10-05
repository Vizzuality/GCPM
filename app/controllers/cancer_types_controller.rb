class CancerTypesController < ApplicationController
  before_action :set_cancer_type, only: :show

  respond_to :html, :js

  def index
  end

  def show
    @page = params.key?(:page) && params[:page] ? params[:page].to_i : 1
    @title = t 'map'
    @filters = %w(projects events)
    @current_type = params.key?(:data) ? params[:data] : 'projects'

    limit = 12 + (@page * 9)

    @events = Event.fetch_all(cancer_types: @cancer_type.id).order('created_at DESC')
    @projects = Project.fetch_all(cancer_types: @cancer_type.id).order('created_at DESC')

    if params.key?(:data) && params[:data] == 'events'
      @items = @events.limit(limit)
      @more = (@events.size > @items.size)
      @items_total = @events.size
    else
      @items = @projects.limit(limit)
      @more = (@projects.size > @items.size)
      @items_total = @projects.size
    end

    respond_with(@items)
    # @filters = %w(projects events)
    # @limit = 15
    # @projects = Project.fetch_all(cancer_types: @cancer_type.id)
    #   .order('created_at DESC')
    #   .limit(params[:limit] ? params[:limit].to_i * @limit : @limit)
    # @projectsCount = Project.fetch_all(cancer_types: @cancer_type.id).length
    # @events = Event.fetch_all(cancer_types: @cancer_type.id)
    #   .order('created_at DESC')
    #   .limit(params[:limit] ? params[:limit].to_i * @limit : @limit)
    # @eventsCount = Event.fetch_all(cancer_types: @cancer_type.id).length

    # @current_type = params[:data] || 'projects'
    # @organizations  = Organization.fetch_all(cancer_types: @cancer_type.id)
    # .order('created_at DESC')
    # .limit(params[:limit] ? params[:limit].to_i * @limit : @limit)
    # @organizationsCount = @organizations.length
  end

  private

  def set_cancer_type
    @cancer_type = CancerType.find_by(id: params['id'])
  end
end
