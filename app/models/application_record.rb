class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def slug_or_id
    self.try(:slug) || self.id
  end
end
