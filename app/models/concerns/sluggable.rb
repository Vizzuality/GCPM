# frozen_string_literal: true
module Sluggable
  extend ActiveSupport::Concern

  included do
    before_validation :check_slug

    validates_uniqueness_of :slug
    validates :slug, presence: true, format: { with: /\A[^\s!#$%^&*()（）=+;:'"\[\]\{\}|\\\/<>?,]+\z/,
                                               allow_blank: true,
                                               message: 'Invalid. Slug must contain at least one letter and no special character' }


    def self.set_by_id_or_slug(param)
      if check_if_id(param)
        find(param)
      else
        find_by(slug: param)
      end
    end

    def self.check_if_id(param)
      param.to_s == param.to_i.to_s
    end

    private

      def check_slug
        unless self.slug.present?
          self.slug = generate_slug
        end
      end

      def generate_slug
        self_name = self.try(:name) || self.try(:title)
        initial_slug = self_name.downcase.parameterize
        temp_slug = initial_slug
        loop.with_index do |_,i|
          break temp_slug unless self.class.name.safe_constantize.exists?(slug: temp_slug)
          temp_slug = initial_slug + "-" + (i+1).to_s
        end
      end

  end

  class_methods do
  end
end
