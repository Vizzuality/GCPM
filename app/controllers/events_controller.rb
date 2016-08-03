class EventsController < ApplicationController
  def index
    @events = Event.all
  end

  def show
    @event = Event.find(params[:id])
    @current_type = params[:type] || 'event-info'
  end

  def new
    @event = Event.new
  end

  def create
    @event = Event.new(event_params)
    if @event.save
      redirect_to @event
    else
      render action: :new
    end
  end

  def edit
    @event = Event.find(params[:id])
  end

  def update
    @event = Event.find(params[:id])
    if @event.update(event_params)
      redirect_to @event
    else
      render action: :edit
    end
  end

  private

  def event_params
    params.require(:event).permit(:title, :description, :website, :excerpt, :participants, :start_date, :end_date, :private, :online, :address, :address2, :city, :country, :state, :latitute, :longitude, :postcode)
  end
end
