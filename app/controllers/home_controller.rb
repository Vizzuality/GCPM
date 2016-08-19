class HomeController < ApplicationController
  def index
    redirect_to map_path and return
  end
end
