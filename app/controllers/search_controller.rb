class SearchController < ApplicationController
  def index
    @search_results = if params[:search].present?
                        type_params = params[:search][:type] unless params[:search][:type] && params[:search][:type].include?('All sections')
                        Search.new(params[:search][:item], type_params).results
                      else
                        []
                      end
    @search_item = params[:search][:item] if params[:search].present?

    @search_type = params[:search][:type] if params[:search].present?
    @sections    = ['All sections', 'Project', 'Investigator', 'Organization', 'CancerType', 'Event', 'User']
    gon.type = @search_type
  end
end
