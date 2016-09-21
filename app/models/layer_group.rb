# == Schema Information
#
# Table name: layer_groups
#
#  id               :integer          not null, primary key
#  name             :string
#  super_group_id   :integer
#  slug             :string
#  layer_group_type :string
#  category         :string
#  active           :boolean
#  order            :integer
#  info             :text
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class LayerGroup < ApplicationRecord
  has_many :agrupations
  has_many :layers, through: :agrupations
  belongs_to :super_group, class_name: 'LayerGroup'
  has_many :sub_groups, class_name: 'LayerGroup', foreign_key: :super_group_id, dependent: :nullify
  accepts_nested_attributes_for :agrupations, :allow_destroy => true
  validate :avoid_recursivity, on: :update
  def avoid_recursivity
    errors.add(:super_group, "This group can't be super group of itself.") if self.super_group_id.present? && self.super_group_id == self.id
  end
  def self.fetch_all(options={})
    layer_groups = LayerGroup.all
    layer_groups = layer_groups.order('name ASC')
    layer_groups
  end
end
