FactoryGirl.define do
  factory(:notification) do
    user
    association :notificable, factory: :project
  end
end
