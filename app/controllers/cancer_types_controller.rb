class CancerTypesController < ApplicationController
  before_action :set_cancer_type, only: :show

  def index
    @title = t 'cancer_types'
  end

  def show
    @filters = %w(projects events)
    @limit = 15
    @projects = Project.fetch_all(cancer_types: @cancer_type.id)
      .order('created_at DESC')
      .limit(params[:limit] ? params[:limit].to_i * @limit : @limit)
    @projectsCount = Project.fetch_all(cancer_types: @cancer_type.id).length
    @events = Event.fetch_all(cancer_types: @cancer_type.id)
      .order('created_at DESC')
      .limit(params[:limit] ? params[:limit].to_i * @limit : @limit)
    @eventsCount = Event.fetch_all(cancer_types: @cancer_type.id).length

    @current_type = params[:data] || 'projects'

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
