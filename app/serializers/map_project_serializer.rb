class MapProjectSerializer < ActiveModel::Serializer
  attributes :location_id, :type, :title, :centroid, :is_project_lead
  def location_id
    @instance_options[:project].id
  end
  def type
    'project'
  end
  def is_project_lead
    research_unit_ids = ResearchUnit.where(address_id: object.id).pluck(:id)
    Membership.where(research_unit_id: research_unit_ids, membership_type: 0).present?
  end
  def title
    @instance_options[:project].title
  end
  def centroid
    '{"type":"point","coordinates":[' + object.latitude.to_s + ',' + object.longitude.to_s + ']}'
  end
end
