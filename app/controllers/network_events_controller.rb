class NetworkEventsController < ApplicationController
  before_action :authenticate_user!, except: :show

  before_action :set_user,         only: :show
  before_action :set_current_user, only: [:new, :create, :edit, :update, :destroy]
  before_action :set_event,        only: [:show, :edit, :update, :destroy]

  def index
  end

  def edit
    if notice
      gon.notice = notice
    end

    gon.online = @event.online
  end

  def new
    @event = Event.new
  end

  def update
    errors = get_errors(event_params)

    if @event.update(event_params) && errors.count == 0
      redirect_to event_path(@event.slug_or_id), notice: 'Event succesfully updated.'
    else
      gon.notice = { text: errors.join(''), show: true }
      render :edit
    end
  end

  def create
    @event = @user.events.build(event_params)

    errors = get_errors(event_params)

    if errors.count == 0 && @event.save
      redirect_to event_path(@event.slug_or_id)
    else
      gon.notice = { text: errors.join(''), show: true }
      render :new
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

    def get_errors(event_params)
      errors = []
      if !event_params['title'].present?
        errors << "<p>Title can't be blank</p>"
      end

      if !event_params['description'].present?
        errors << "<p>Description can't be blank</p>"
      end

      if !event_params['start_date'].present?
        errors << "<p>Start date can't be blank</p>"
      end

      if !event_params['end_date'].present?
        errors << "<p>End date can't be blank</p>"
      end

      if event_params['online'] == 'false' && (!event_params['country'].present? || event_params['country'] == '')
        errors << "<p>You must select a country</p>"
      end

      if event_params['online'] == 'false' && (!event_params['city'].present? || event_params['city'] == '')
        errors << "<p>You must select a city</p>"
      end

      return errors
    end
end
