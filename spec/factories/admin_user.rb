FactoryGirl.define do
  factory :admin_user, class: User do
    email "admin@example.com"
    password 'password'
    password_confirmation { |u| u.password }
    confirmed_at { Time.now }
    role 'admin'
  end
end
