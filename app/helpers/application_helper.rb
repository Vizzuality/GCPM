module ApplicationHelper
  def active_page?(path)
    request.path == path
  end
end
