class EventsController < ApplicationController
  def show
    @event = Event.find(params[:id])
    gon.server_params = { }
    gon.api_location_path = "/api/map/events/#{params[:id]}"
  end
end
