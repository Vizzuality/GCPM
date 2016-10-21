class CountryArraySerializer < ActiveModel::Serializer
  attributes :id, :name, :country_iso_3, :region_name, :region_iso

  def name
    object.try(:name) || object.try(:country_name)
  end

  def region_name
    object.try(:region_name)
  end

  def region_iso
    object.try(:region_iso)
  end

  def country_iso_3
    object.try(:country_iso_3)
  end
end
