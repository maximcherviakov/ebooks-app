Feature: Book Details
  As a user
  I want to view, read and download my books
  So that I can manage my book collection effectively

  Background:
    Given I have a registered user account
    And I am logged in with my credentials
    And I navigate to the books page
    And I click the "Add book" link
    And I enter "Book Title" as the book title
    And I enter "Sample book description" as the book description
    And I enter "John Doe" as the book author
    And I enter "2023" as the book year
    And I select the genres "Science Fiction" and "Fantasy"
    And I upload a PDF file
    And I click the "Add new book" button
    And I should see the book "Book Title" in my collection

  Scenario: View book details
    When I click on the book cover
    Then I should see the book details with updated information

  Scenario: Read book online
    When I click on the book cover
    And I click the "Read Online" button
    Then I should see the PDF viewer

  Scenario: Download book
    When I click on the book cover
    And I click the "Download" link
    Then I should be able to download the book
