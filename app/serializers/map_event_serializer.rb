class MapEventSerializer < ActiveModel::Serializer
  attributes :id, :type, :title, :centroid
  def type
    'event'
  end
  def centroid
    '{"type":"point","coordinates":[' + object.latitude.to_s + ',' + object.longitude.to_s + ']}'
  end
end
