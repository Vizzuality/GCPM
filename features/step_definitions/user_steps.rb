Then /^I should have an user$/ do
  User.all.size.should >= 1
end

Given /^I am authenticated user$/ do
  @user = FactoryGirl.create(:user, email: 'user@sample.com')
  email = @user.email
  password = @user.password
  visit '/users/sign_in'
  fill_in "user_email", with: email
  fill_in "user_password", with: password
  click_button "Log in"
end

Given /^I am registrated user$/ do
  @user = FactoryGirl.create(:user, email: 'test-user@sample.com', password: 'password')
end

Given /^user$/ do
  FactoryGirl.create(:user, email: 'user-2@sample.com')
end

Then /^I should have an valid auth token for "([^\"]*)"$/ do |user|
  User.find_by_email(user).authentication_token.should == User.find_by_email(user).authentication_token
end

Then /^I should have an invalid auth token for "([^\"]*)"$/ do |user|
  User.find_by_email(user).authentication_token.should == nil
end
