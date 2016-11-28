class HomeController < ApplicationController
  def index
    @projects = Project.all.limit(6).order('created_at DESC')
    @events = Event.all.limit(5).order('created_at DESC')
    @organizations = Organization.all.limit(4).order('created_at DESC')

    @projects_total = Project.fetch_all.count()
    @events_total = Event.fetch_all.count()
    @people_total = Investigator.fetch_all.count()

    if notice
      gon.notice = notice
    end

  end
end
