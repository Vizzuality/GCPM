class HomeController < ApplicationController
  def index
    @featureds = Featured.featurables
    @projects_total = Project.all.distinct.count()
    @events_total = Event.all.distinct.count()
    @people_total = Investigator.all.distinct.count()
    @post_total = Post.all.distinct.count()

    gon.isMobile = browser.device.mobile?
    gon.carto_account = ENV["CARTODB_ACCOUNT"]
    gon.carto_key = ENV["CARTODB_KEY"]

    if notice
      gon.notice = notice
    end

  end
end
