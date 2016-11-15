module RoutesHelper
  def build_search_link(class_name, search_object_id)
    case class_name.to_s
    when 'Project'      then project_path(search_object_id)
    when 'Investigator' then investigator_path(search_object_id)
    when 'CancerType'   then cancer_path(search_object_id)
    when 'Event'        then event_path(search_object_id)
    when 'Organization' then organization_path(search_object_id)
    when 'User'         then user_path(search_object_id)
    else
      '#'
    end
  end

  def self.by_slug_or_id(object)
    object.try(:slug) || object.try(:id)
  end

  def by_slug_or_id(object)
    RoutesHelper.by_slug_or_id(object)
  end
end
