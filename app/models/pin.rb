class Pin < ApplicationRecord
  belongs_to :post
  belongs_to :pinable, polymorphic: true

  scope :on_projects,      -> { where(pinable_type: 'Project')      }
  scope :on_organizations, -> { where(pinable_type: 'Organization') }
  scope :on_cancer_types,  -> { where(pinable_type: 'CancerType')   }
  scope :on_countries,     -> { where(pinable_type: 'Country')      }
end
