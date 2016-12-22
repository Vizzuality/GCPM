FactoryGirl.define do
  factory(:notification) do
    user
    association :notificable, factory: :cancer_type
  end
end
