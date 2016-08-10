class OrganizationArraySerializer < ActiveModel::Serializer
  attributes :id, :name

  def name
    object.try(:name) || object.try(:country_name)
  end
end
