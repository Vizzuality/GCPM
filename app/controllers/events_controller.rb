class EventsController < ApplicationController
  def show
    @event = Event.find(params[:id])
    gon.server_params = {}
    gon.api_location_path = "/api/map/events/#{params[:id]}"
    @filters = %w(info)
    @current_type = params.key?(:data) ? params[:data] : 'info'
  end
end
