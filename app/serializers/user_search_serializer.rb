class UserSearchSerializer < ActiveModel::Serializer
  attributes :id, :name, :photo
  def photo
    object.avatar.url
  end
end
