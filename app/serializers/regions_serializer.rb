class RegionsSerializer < ActiveModel::Serializer
  attributes :region_name, :region_iso, :region_centroid
  has_many :countries

  def countries
    Country.where(region_iso: object.region_iso).select(:id, :country_name, :country_iso, :country_centroid)
  end
end
