class EventsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]

  before_action :set_user,         only: :show
  before_action :set_current_user, only: [:new, :create, :edit, :update]
  before_action :set_event,        only: [:show, :edit, :update]

  def index
    @events = Event.all
  end

  def show
  end

  def new
    @event = Event.new
  end

  def create
    if @event.save
      redirect_to @event
    else
      render action: :new
    end
  end

  def edit
  end

  def update
    if @event.update(event_params)
      redirect_to @event
    else
      render action: :edit
    end
  end

  private

    def set_user
      @user = User.find(params[:user_id])
    end

    def set_current_user
      @user = current_user
    end

    def set_event
      @event = @user.events.find(params[:id])
    end

    def event_params
      params.require(:event).permit(:title, :description, :website, :excerpt, :participants, :start_date, :end_date, :private, :online, :address, :address2, :city, :country, :state, :latitute, :longitude, :postcode)
    end
end
