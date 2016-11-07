# == Schema Information
#
# Table name: widgets
#
#  id           :integer          not null, primary key
#  name         :string
#  slug         :string
#  xname        :string
#  xunit        :string
#  yname        :string
#  yunit        :string
#  graphic_type :string
#  legend       :text
#  source       :text
#  query        :text
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class Widget < ApplicationRecord
end
