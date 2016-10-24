class EventsController < ApplicationController
  def show
    @event = Event.find(params[:id])
    gon.server_params = {}
    gon.api_location_path = "/api/map/events/#{params[:id]}"
    @filters = %w(info)
    @current_type = params.key?(:data) ? params[:data] : 'info'

    if current_user
      @followed = current_user.following?(@event)
      @followed_id = @event.id
      @followed_resource = 'Event'
    end
  end

  def new
    @event = Event.new
  end

  def create
    @event = Event.new(event_params)
    if @event.save
      # your logic here
    else
      # your logic here
    end
  end

  def edit
    @event = Event.find(params[:id])
  end

  def update
    @event = Event.find(params[:id])
    if @event..update_attributes(event_params)
      # your logic here
    else
      # your logic here
    end
  end

  def destroy
    @event = Event.new(event_params)
    if @event.destroy
      # your logic here
    else
      # your logic here
    end
  end

  private

  def event_params
    params.require(:event).permit(:title, :description, :website, :excerpt, :participants, :start_date, :end_date, :private, :online, :address, :address2, :city, :country, :state, :latitude, :longitude, :postcode)
  end
end
