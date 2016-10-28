class EventsController < ApplicationController
  before_action :authenticate_user!, except: :show

  before_action :set_user,         only: :show
  before_action :set_current_user, only: [:new, :create, :edit, :update, :destroy]
  before_action :set_event,        only: [:show, :edit, :update, :destroy]

  def show
    @event = Event.find(params[:id])
    gon.server_params = {}
    gon.api_location_path = "/api/map/events/#{params[:id]}"
    gon.start_date = @event.start_date || 0
    gon.end_date = @event.end_date || 0

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
    @event.user = current_user

    if @event.save
      redirect_to event_path(@event.id)
    else
      render :new, error: true
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
      redirect_to user_path(@user), notice: 'Event succesfully deleted.'
    else
      redirect_to edit_user_event_path(@user), notice: "There was an error and event can't be deleted."
    end
  end

  private

  def set_user
    @user = User.find(current_user.id) if current_user
  end

  def set_current_user
    @user = current_user
  end

  def set_event
    @event = Event.find(params[:id])
  end

  def event_params
    params.require(:event).permit(:title, :description, :website, :excerpt, :participants, :start_date, :end_date, :private, :online, :address, :address2, :city, :country, :state, :latitude, :longitude, :postcode)
  end
end
