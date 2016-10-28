class NetworkEventsController < ApplicationController
  before_action :authenticate_user!, except: :show

  before_action :set_user,         only: :show
  before_action :set_current_user, only: [:new, :create, :edit, :update, :destroy]
  before_action :set_event,        only: [:show, :edit, :update, :destroy]

  def index
  end

  def show
  end

  def edit
  end

  def new
    @event = Event.new
  end

  def update
    if @event.update(event_params)
      redirect_to event_path(@event), notice: 'Event succesfully updated.'
    else
      render :edit, notice: "Event can't be updated."
    end
  end

  def create
    # @event = Event.new(event_params)
    # @event.user = current_user

    # if @event.save
    #   redirect_to event_path(@event.id)
    # else
    #   redirect_to new_event_path(error: true)
    # end

    @event = @user.events.build(event_params)
    if @event.save
      redirect_to event_path(@event.id)
    else
      render :new, notice: @project.errors.full_messages
    end
  end

  def destroy
    if @event.destroy
      redirect_to user_path(@user, { data: 'events' }), notice: 'Event succesfully deleted.'
    else
      redirect_to user_path(@user), notice: "There was an error and event can't be deleted."
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
      @event = Event.find(params[:id])
    end

    def event_params
      params.require(:event).permit!
    end
end
