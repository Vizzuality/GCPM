# frozen_string_literal: true
module Sluggable
  extend ActiveSupport::Concern

  included do
    before_update :assign_slug

    before_validation(on: [:create, :update]) do
      check_slug
    end

    validates_uniqueness_of :slug
    validates :slug, presence: true, format: { with: /\A[^\s!#$%^&*()（）=+;:'"\[\]\{\}|\\\/<>?,]+\z/,
                                               allow_blank: true,
                                               message: 'Invalid. Slug must contain at least one letter and no special character' }


    def self.set_by_id_or_slug(param)
      object_id = where(slug: param).or(where(id: param)).pluck(:id).min
      find(object_id) if object_id.present?
    end

    private

      def check_slug
        self_name = self.try(:name) || self.try(:title)
        self.slug = self_name.downcase.parameterize if self_name.present? && self.slug.blank?
      end

      def assign_slug
        self.slug = self.slug.downcase.parameterize
      end
  end

  class_methods do
  end
end
