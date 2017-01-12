class NetworkEventsController < ApplicationController
  before_action :authenticate_user!, except: :show

  before_action :set_user,         only: :show
  before_action :set_current_user, only: [:new, :create, :edit, :update, :destroy]
  before_action :set_event,        only: [:show, :edit, :update, :destroy]

  def index
  end

  def edit
    gon.online = @event.online
  end

  def new
    @event = Event.new
  end

  def update
    if !@event.start_date.present? || !@event.end_date.present?
      gon.error = "Dates"
    end

    if !@event.online && (!@event.country.present? || @event.country == '')
      gon.error = true
    end

    if @event.update(event_params)
      redirect_to event_path(@event.slug_or_id), notice: 'Event succesfully updated.'
    else
      gon.error = true
      render :edit, notice: @event.errors.full_messages.join(', ')
    end
  end

  def create
    @event = @user.events.build(event_params)

    if !@event.start_date.present? || !@event.end_date.present?
      gon.error = true
      render :new, error: true and return
    end

    if !@event.online
      if !@event.country.present? || @event.country == ''
        gon.error = true
        render :new, error: true and return
      end

      if !@event.country.present? || @event.country == ''
        gon.error = true
        render :new, error: true and return if !@event.city.present? || @event.city == ''
      end
    end

    if @event.save
      redirect_to event_path(@event.slug_or_id)
    else
      gon.error = true
      render :new, error: true, notice: @event.errors.full_messages
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
      @event = Event.set_by_id_or_slug(params[:id])
    end

    def event_params
      params.require(:event).permit!
    end
end
