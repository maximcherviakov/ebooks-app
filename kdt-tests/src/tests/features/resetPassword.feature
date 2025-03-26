Feature: Reset Password
  As a registered user
  I want to be able to reset my password
  So that I can maintain account security

  Background:
    Given I have a registered user account
    And I am logged in with my credentials

  Scenario: Reset password with valid data
    When I navigate to the settings page
    And I enter my current password
    And I enter a valid new password
    And I confirm the new password
    And I click the "Update Password" button
    Then I should see the password updated successfully message
    And I should be able to login with my new password

  Scenario: Reset password with wrong original password
    When I navigate to the settings page
    And I enter an incorrect current password
    And I enter a valid new password
    And I confirm the new password
    And I click the "Update Password" button
    Then I should see an unauthorized error

  Scenario: Reset password with too short new password
    When I navigate to the settings page
    And I enter my current password
    And I enter a password that is too short as new password
    And I confirm the new password
    And I click the "Update Password" button
    Then I should see a new password error message "Password must be at least 6 characters long"
    And I should stay on the settings page

  Scenario: Reset password with non-matching passwords
    When I navigate to the settings page
    And I enter my current password
    And I enter a valid new password
    And I enter a different password in the confirm field
    And I click the "Update Password" button
    Then I should see a confirm password error message "Passwords do not match"
    And I should stay on the settings page

  Scenario: Reset password with empty original password
    When I navigate to the settings page
    And I enter an empty current password
    And I enter a valid new password
    And I confirm the new password
    And I click the "Update Password" button
    Then I should see a current password error message "Please enter your current password"
    And I should stay on the settings page

  Scenario: Reset password with empty new password
    When I navigate to the settings page
    And I enter my current password
    And I enter an empty new password
    And I confirm the new password
    And I click the "Update Password" button
    Then I should see a new password error message "Password must be at least 6 characters long"
    And I should stay on the settings page
