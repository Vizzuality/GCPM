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

class WidgetSerializer < ActiveModel::Serializer
  cache key: "widget"
  attributes :name, :slug, :graphic_type, :xaxis, :yaxis, :query, :legend, :source

  def xaxis
    {name: object.xname, source: object.xunit}
  end
  def yaxis
    {name: object.yname, source: object.yunit}
  end
end
