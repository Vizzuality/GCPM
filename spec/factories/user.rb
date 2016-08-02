FactoryGirl.define do
  factory :user do
    sequence(:email) { |n| "pepe#{n}@vizzuality.com" }

    password 'password'
    password_confirmation { |u| u.password }
    confirmed_at { Time.now }
  end
end
