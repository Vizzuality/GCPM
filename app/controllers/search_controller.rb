class SearchController < ApplicationController
  def index
    @search_results = if params[:search].present?
                        type_params = params[:search][:type] unless params[:search][:type].include?('All sections')
                        Search.new(params[:search][:item], type_params).results
                      else
                        []
                      end
    @search_item = params[:search][:item] if params[:search].present?
    @search_type = params[:search].present? ? params[:search][:type] : 'All sections'

    gon.type = @search_type
  end
end
