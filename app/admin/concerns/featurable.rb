module Featurable
  def self.extended(base)
    base.instance_eval do
      member_action :feature, method: :get do
        f = Featured.new
        f.featurable = resource
        f.save!
        redirect_to collection_url, notice: "Featured!"
      end

      member_action :unfeature, method: :get do
        f = Featured.find_by(featurable: resource)
        f.destroy
        redirect_to collection_url, notice: "Unfeatured!"
      end
    end
  end
end
