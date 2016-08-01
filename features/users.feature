Feature: Users
In order to manage users
As an user
I want to register, login and edit account

  Scenario: User login
    Given I am registrated user
    And I am on the login page
    And I fill in "Email" with "test-user@sample.com"
    And I fill in "Password" with "password"
    And I press "Log in"
    Then I should see "Signed in successfully."
    And I should be on the home page

  Scenario: User logout
    Given I am authenticated user
    And I am on the home page
    When I follow "Logout" within ".user-profile"
    Then I should see "Signed out successfully."
    And I am on the home page

  Scenario: Password reset
    Given I am registrated user
    And I am on the login page
    Then I follow "Forgot your password?"
    And I fill in "Email" with "test-user@sample.com"
    And I press "Send me reset password instructions"
    Then I should see "You will receive an email with instructions on how to reset your password in a few minutes."
    And "test-user@sample.com" should receive an email
    When "test-user@sample.com" opens the email
    And I follow "Change my password" in the email
    When I fill in "New password" with "qwertyui"
    And I fill in "Confirm new password" with "qwertyui"
    And I press "Change my password"
    Then I should see "Your password has been changed successfully."
    And I should be on the home page

  Scenario: User can edit account data
    Given I am authenticated user
    And I am on the home page
    When I go to the profile edit page for "test-user@sample.com"
    And I should see "Edit User"
    When I fill in "user_email" with "test@test.com"
    And I fill in "user_current_password" with "password"
    And I press "Update"
    Then I should see "Your account has been updated successfully."
    And I should be on the home page
