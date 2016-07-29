class UsersController < ApplicationController

  def show
    @user = User.find(params[:id])
    # @projects = .projects
  end

end
