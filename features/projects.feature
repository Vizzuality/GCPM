Feature: Projects
In order to manage projects
As an user
I want to manage an project

  Scenario: Visitor can view projects page and project page without login
    Given user
    And first project
    And project by user
    When I go to the user projects page for "user-2@sample.com"
    Then I should see "First project by user"
    And I should see "ToFactory: RubyParser exception parsing this attribute"
    And I should not see "Delete"
    And I should not see "Edit"
    When I follow "First project by user"
    Then I should be on the project page for "First project by user"

  Scenario: User can edit owned project
    Given I am authenticated user
    And first project
    When I go to the edit project page for "user@sample.com" "First project by user"
    And I fill in "project_title" with "New title"
    And I fill in "project_summary" with "Lorem ipsum.."
    And I press "Update"
    Then I should be on the project page for "New title"
    And I should see "New title"

  Scenario: User can create project
    Given I am authenticated user
    When I go to the new project page for "user@sample.com"
    And I fill in "project_title" with "Created project by user"
    And I fill in "project_summary" with "Lorem ipsum.."
    And I press "Submit"
    Then I should be on the profile page for "user@sample.com"
    And I should have one project

  Scenario: User delete owned project
    Given I am authenticated user
    And project by user
    When I go to the user projects page for "user@sample.com"
    And I follow "Delete"
    Then I should be on the user projects page for "user@sample.com"
    And I should see "Project succesfully deleted."

  Scenario: User can view index project page with edit and delete links
    Given I am authenticated user
    And first project
    When I go to the user projects page for "user@sample.com"
    And I should see "First project by user"
    And I should see "Delete"
    And I should see "Edit"
    Then I should not see "User project"
