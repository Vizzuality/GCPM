class UsersController < ApplicationController
  before_action :set_user

  def show
    @projects = user_signed_in? && @user == current_user ? @user.projects : @user.active_projects
    @current_type = params[:type] || 'projects'
    @filters = ['projects']
  end

  private

    def set_user
      @user = User.find(params[:id])
    end
end
