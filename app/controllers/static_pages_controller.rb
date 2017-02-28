class StaticPagesController < ApplicationController
  before_action :set_static_page

  def show
  end

  private

    def set_static_page
      @static_page = StaticPage.set_by_id_or_slug(params[:id])
      if @static_page.present?
        return
      else
        render file: 'public/404.html', status: :not_found
      end
    end
end
