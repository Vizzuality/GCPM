class CancerTypesController < ApplicationController
  before_action :set_cancer_type, only: :show

  respond_to :html, :js

  def index
  end

  def show
    @page = params.key?(:page) && params[:page] ? params[:page].to_i : 1
    @title = t 'map'
    @filters = %w(projects people events)
    @current_type = params.key?(:data) ? params[:data] : 'projects'
    gon.server_params = { 'cancer_types[]': params[:id] }

    limit = 12 + (@page * 9)

    @events = Event.fetch_all(cancer_types: @cancer_type.id).order('created_at DESC')
    @projects = Project.fetch_all(cancer_types: @cancer_type.id).order('created_at DESC')
    @people = Investigator.fetch_all({cancer_types: @cancer_type.id}).order('created_at DESC')
    if params.key?(:data) && params[:data] == 'events'
      @items = @events.limit(limit)
      @more = (@events.size > @items.size)
      @items_total = @events.size
    elsif params.key?(:data) && params[:data] == 'projects'
      @items = @projects.limit(limit)
      @more = (@projects.size > @items.size)
      @items_total = @projects.size
    elsif params.key?(:data) && params[:data] == 'people'
      puts '############################################'
      puts params
      puts '############################################'
      @items = @people.limit(limit)
      @more = (@people.size > @items.size)
      @items_total = @people.size
    end

    respond_with(@items)
  end

  private

  def set_cancer_type
    @cancer_type = CancerType.find_by(id: params['id'])
  end
end
