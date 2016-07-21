class MapController < ApplicationController
  def index
    @title = t 'map'
    @params = request.query_parameters
  end
end
