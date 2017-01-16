# == Schema Information
#
# Table name: widgets
#
#  id           :integer          not null, primary key
#  name         :string
#  slug         :string
#  graphic_type :string
#  legend       :text
#  source       :text
#  query        :text
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  x_axis       :text
#  y_axis       :text
#  inner_page   :string
#

class Widget < ApplicationRecord
  include ActAsFeatured
end
