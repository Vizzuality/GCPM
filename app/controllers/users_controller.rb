class UsersController < ApplicationController
  before_action :set_user

  def show
    @projects = user_signed_in? && @user == current_user ? @user.projects.includes(:cancer_types) : @user.published_projects
    @current_type = params[:type] || 'projects'
    @filters = ['projects']
    @isProfile = true
  end

  private

    def set_user
      @user = User.find(params[:id])
    end
end
