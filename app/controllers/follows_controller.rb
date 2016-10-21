class FollowsController < ApplicationController
  before_action :find_resource, only: [:create, :destroy]
  before_action :find_user, only: [:block, :unblock]

  def create
    follow = current_user.follow(@entity)
    if follow
      render json: { data: follow }, status: 201
    else
      render json: { error: 'An error has ocurred. Please, try again later.' }
    end
  end
  def destroy
    if current_user.stop_following(@entity)
      render json: nil, status: 204
    else
      render json: { error: 'An error has ocurred. Please, try again later.' }
    end
  end
  def block
    if current_user.block(@user)
      respond_to do |format|
        format.js
      end
    else
      respond_to do |format|
          format.js{ render js: "alert('An error has ocurred. Please, try again later.');" }
        end
    end
  end
  def unblock
    if current_user.unblock(@user)
      respond_to do |format|
        format.js
      end
    else
      respond_to do |format|
          format.js{ render js: "alert('An error has ocurred. Please, try again later.');" }
        end
    end
  end

  private

  def find_resource
    if @entity = params[:resource].classify.safe_constantize.send(:find, params[:id])
      @entity
    else
      not_found
    end
  end

  def find_user
    if @user = User.find(params[:user_id])
      @user
    else
      not_found
    end
  end

  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

end
