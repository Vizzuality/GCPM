# == Schema Information
#
# Table name: investigators
#
#  id         :integer          not null, primary key
#  name       :string
#  email      :string
#  website    :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'rails_helper'

RSpec.describe Investigator, type: :model do
  # pending "add some examples to (or delete) #{__FILE__}"
end
