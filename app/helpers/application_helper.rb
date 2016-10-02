module ApplicationHelper
  def active_page?(path)
    request.path == path
  end

  def active_param?(name,value)
    params = request.query_parameters
    params[name] == value ? '-active' : ''
  end

  def title(page_title)
    provide :title, page_title.to_s
  end
end
