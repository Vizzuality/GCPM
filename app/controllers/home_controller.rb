class HomeController < ApplicationController
  def index
    @projects = Project.all.limit(6).order('created_at DESC')
    @events = Event.all.limit(3).order('created_at DESC')

    @projects_total = Project.all.count()
    @events_total = Event.all.count()
    @people_total = Investigator.all.count()
  end
end
