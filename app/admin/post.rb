#  id         :integer          not null, primary key
#  title      :string
#  body       :text
#  user_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null

ActiveAdmin.register Post do
  menu parent: "Entities"
  extend Featurable




end
