# == Schema Information
#
# Table name: static_pages
#
#  id          :integer          not null, primary key
#  name        :string
#  slug        :string
#  path_prefix :string
#  body        :text
#  published   :boolean          default(TRUE)
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class StaticPage < ApplicationRecord
  include Sluggable

  before_validation :check_path_and_route

  validates_presence_of   :name, :body
  validates_uniqueness_of :name, :slug, :path_prefix

  scope :published, -> { where(published: true) }

  after_save :reload_routes

  class << self
    def load_routes
      if StaticPage.table_exists?
        StaticPage.published.each do |page|
          Rails.application.routes.draw do
            get page.slug, to: 'static_pages#show', as: page.path, id: page.slug
          end
        end
      end
    end
  end

  def path
    if path_prefix.present?
      path_prefix
    else
      slug.underscore
    end
  end

  private

    def reload_routes
      Rails.application.routes_reloader.reload!
    end

    def check_path_and_route
      if self.path_prefix.present?
        self.path_prefix = self.path_prefix.downcase.underscore
      else
        self.path_prefix = slug.underscore
      end

      return unless url_exists?

      if Rails.application.routes.url_helpers.respond_to?("#{self.path_prefix}_path")
        errors.add(:path_prefix, 'already in use! Please chenge the existing route in the routes file or provide a new one.')
      end
    end

    def url_exists?
      begin
        Rails.application.routes.recognize_path(self.slug, method: :get)
        errors.add(:slug, "invalid route name, slug already in use: '#{self.slug}'! Please chenge the existing route name in the routes file or provide a new slug.")
      rescue
        false
      end
    end
end
