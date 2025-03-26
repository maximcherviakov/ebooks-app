Feature: User Registration
  As a new user
  I want to register an account
  So that I can access the application

  Scenario: Register user with valid data
    When I navigate to the registration page
    And I enter valid registration details
    And I click the "Sign up" button
    Then I should be registered successfully
    And I should be redirected to the dashboard

  Scenario: Register user with short username
    When I navigate to the registration page
    And I enter a username that is too short
    And I enter a valid email
    And I enter a valid password
    And I click the "Sign up" button
    Then I should see a username error message "Username must be at least 3 characters long."
    And I should stay on the registration page

  Scenario: Register user with empty username
    When I navigate to the registration page
    And I enter an empty username
    And I enter a valid email
    And I enter a valid password
    And I click the "Sign up" button
    Then I should see a username error message "Please enter a username."
    And I should stay on the registration page

  Scenario: Register user with invalid email (no @)
    When I navigate to the registration page
    And I enter a valid username
    And I enter an email without @ symbol
    And I enter a valid password
    And I click the "Sign up" button
    Then I should see an email error message "Please enter a valid email address."
    And I should stay on the registration page

  Scenario: Register user with invalid email (no .)
    When I navigate to the registration page
    And I enter a valid username
    And I enter an email without dot
    And I enter a valid password
    And I click the "Sign up" button
    Then I should see an email error message "Please enter a valid email address."
    And I should stay on the registration page

  Scenario: Register user with invalid email (missing username)
    When I navigate to the registration page
    And I enter a valid username
    And I enter an incomplete email
    And I enter a valid password
    And I click the "Sign up" button
    Then I should see an email error message "Please enter a valid email address."
    And I should stay on the registration page

  Scenario: Register user with empty email
    When I navigate to the registration page
    And I enter a valid username
    And I enter an empty email
    And I enter a valid password
    And I click the "Sign up" button
    Then I should see an email error message "Please enter a valid email address."
    And I should stay on the registration page

  Scenario: Register user with short password
    When I navigate to the registration page
    And I enter a valid username
    And I enter a valid email
    And I enter a password that is too short
    And I click the "Sign up" button
    Then I should see a password error message "Password must be at least 6 characters long."
    And I should stay on the registration page

  Scenario: Register user with empty password
    When I navigate to the registration page
    And I enter a valid username
    And I enter a valid email
    And I enter an empty password
    And I click the "Sign up" button
    Then I should see a password error message "Password must be at least 6 characters long."
    And I should stay on the registration page
