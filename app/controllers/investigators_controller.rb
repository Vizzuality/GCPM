class InvestigatorsController < ApplicationController
  before_action :set_investigators, only: :show

  respond_to :html, :js

  def index
  end

  def show
    @page = params.key?(:page) && params[:page] ? params[:page].to_i : 1
    @filters = %w(projects)
    @current_type = params.key?(:data) ? params[:data] : 'projects'

    gon.server_params = { 'investigators[]': params[:id] }

    limit = 12 + (@page * 9)

    @projects = Project.fetch_all(investigators: @investigator.id).order('created_at DESC')

    @items = @projects.limit(limit)
    @more = (@projects.size > @items.size)
    @items_total = @projects.size

    if current_user
      @followed = current_user.following?(@investigator)
      @followed_id = @investigator.id
      @followed_resource = 'Investigator'
    end
    
    respond_with(@items)
  end

  private

    def set_investigators
      @investigator = Investigator.find_by(id: params[:id])
    end
end
