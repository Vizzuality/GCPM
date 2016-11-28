module ActAsFeatured
  extend ActiveSupport::Concern

  included do

    has_one :featured, as: :featurable

    def featured?
      self.featured == nil ? false : true
    end

  end

  class_methods do
  end
end
