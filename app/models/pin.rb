# == Schema Information
#
# Table name: pins
#
#  id           :integer          not null, primary key
#  post_id      :integer
#  pinable_type :string
#  pinable_id   :integer
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class Pin < ApplicationRecord
  belongs_to :post
  belongs_to :pinable, polymorphic: true

  scope :on_projects,      -> { where(pinable_type: 'Project')      }
  scope :on_organizations, -> { where(pinable_type: 'Organization') }
  scope :on_cancer_types,  -> { where(pinable_type: 'CancerType')   }
  scope :on_countries,     -> { where(pinable_type: 'Country')      }
  scope :on_specialities,  -> { where(pinable_type: 'Speciality')   }
end
