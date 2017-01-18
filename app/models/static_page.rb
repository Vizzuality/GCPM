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
  validates_presence_of :name, :body

  include Sluggable

  scope :published, -> { where(published: true) }

  after_save :reload_routes

  class << self
    def load_routes
      if StaticPage.table_exists?
        StaticPage.available_pages.each do |page|
          Rails.application.routes.draw do
            get page.slug, to: 'static_pages#show', as: page.path, id: page.slug
          end
        end
      end
    end

    def available_pages
      all.published
    end
  end

  def path
    if path_prefix.present?
      path_prefix
    else
      slug.underscore
    end
  end

  def reload_routes
    Rails.application.routes_reloader.reload!
  end
end
