Feature: User Login Functionality
  As a user of the eBooks app
  I want to be able to log in with my credentials
  So that I can access my account and use the application

  Background:
    Given I have a registered user account

  Scenario: Login with valid credentials
    When I navigate to the login page
    And I enter my email and password
    And I click the "Sign in" button
    Then I should be logged in successfully
    And I should be redirected to the dashboard

  Scenario: Login with invalid email
    When I navigate to the login page
    And I enter an invalid email and my password
    And I click the "Sign in" button
    Then I should see an unauthorized error
    And I should see a "Back to Home" button

  Scenario: Login with invalid password
    When I navigate to the login page
    And I enter my email and an invalid password
    And I click the "Sign in" button
    Then I should see an unauthorized error
    And I should see a "Back to Home" button

  Scenario: Login with invalid email and password
    When I navigate to the login page
    And I enter an invalid email and an invalid password
    And I click the "Sign in" button
    Then I should see an unauthorized error
    And I should see a "Back to Home" button

  Scenario: Login with empty email
    When I navigate to the login page
    And I enter an empty email and my password
    And I click the "Sign in" button
    Then I should see a bad request error
    And I should see a "Back to Home" button

  Scenario: Login with empty password
    When I navigate to the login page
    And I enter my email and an empty password
    And I click the "Sign in" button
    Then I should see a bad request error
    And I should see a "Back to Home" button

  Scenario: Login with empty email and password
    When I navigate to the login page
    And I enter an empty email and an empty password
    And I click the "Sign in" button
    Then I should see a bad request error
    And I should see a "Back to Home" button
