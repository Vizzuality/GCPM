class EventsController < ApplicationController
  def show
    @event = Event.find(params[:id])
    @current_type = params[:type] || 'event-info'
  end
end
