FactoryGirl.define do
  factory :event do
    title Faker::Lorem.word
    description Faker::Lorem.word
    start_date Time.now - 10.days
    end_date Time.now
  end
end
