class OrganizationArraySerializer < ActiveModel::Serializer
  attributes :id, :name, :country_iso_3, :region_name, :region_iso, :funder

  def region_name
    object.try(:region_name)
  end

  def region_iso
    object.try(:region_iso)
  end

  def country_iso_3
    object.try(:country_iso_3)
  end

  def funder
    object.is_funder?
  end
end
