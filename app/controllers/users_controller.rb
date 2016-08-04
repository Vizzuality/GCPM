class UsersController < ApplicationController
  before_action :set_user

  def show
    @limit = 1
    @limitFollow = 1

    @projects = user_signed_in? && @user == current_user ? @user.projects.includes(:cancer_types).limit(params[:limit] ?
      params[:limit].to_i * @limit : @limit) :
      @user.published_projects.limit(params[:limit] ? params[:limit].to_i * @limit : @limit)
    @current_type = params[:type] || 'projects'
    @filters = ['projects', 'events']
    @isProfile = true
    @events = @user.events.limit(params[:limit] ? params[:limit].to_i * @limit : @limit)
  end

  private

    def set_user
      @user = User.find(params[:id])
    end
end
