# == Schema Information
#
# Table name: pictures
#
#  id          :integer          not null, primary key
#  title       :string
#  description :text
#  url         :string
#  published   :boolean
#  image       :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Picture < ApplicationRecord
  mount_uploader :image, PictureUploader

  include ActAsFeatured
end
