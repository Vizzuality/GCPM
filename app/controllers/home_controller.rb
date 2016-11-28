class HomeController < ApplicationController
  def index
    @featureds = Featured.featurables
    @projects_total = Project.all.distinct.count()
    @events_total = Event.all.distinct.count()
    @people_total = Investigator.all.distinct.count()

    if notice
      gon.notice = notice
    end

  end
end
