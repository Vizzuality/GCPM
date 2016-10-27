FactoryGirl.define do
  factory :event do
    title Faker::Lorem.word
    description Faker::Lorem.word
  end
end
