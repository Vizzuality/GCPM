class UsersController < ApplicationController
  before_action :set_user

  def show
    @limit = 6
    @limitFollow = 6

    @projects = user_signed_in? && @user == current_user ? @user.projects.includes(:cancer_types).limit(params[:limit] ?
      params[:limit].to_i * @limit : @limit) :
      @user.published_projects.limit(params[:limit] ? params[:limit].to_i * @limit : @limit)
    @events = @user.events.limit(params[:limit] ? params[:limit].to_i * @limit : @limit)

    @current_type = params[:type] || 'projects'
    @filters = ['projects', 'events']
    @isProfile = true
  end

  private

    def set_user
      @user = User.find(params[:id])
    end
end
