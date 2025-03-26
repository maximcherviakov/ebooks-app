Feature: Update Books
  As a user
  I want to update my books
  So that I can keep my book information accurate

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

  Scenario: Update book with valid data
    When I hover over the book card
    And I click the edit button
    Then I should see the book form with existing data
    When I enter "Updated Book Title" as the book title
    And I enter "Updated book description" as the book description
    And I enter "Updated Author Name" as the book author
    And I enter "2022" as the book year
    And I select the genres "Mystery" and "Thriller"
    And I upload a PDF file
    And I click the "Update" button
    Then I should see the book "Updated Book Title" in my collection
    When I click on the book cover
    Then I should see the book details with updated information

  Scenario: Update book with title unchanged
    When I hover over the book card
    And I click the edit button
    Then I should see the book form with existing data
    When I enter "Updated book description" as the book description
    And I enter "Updated Author Name" as the book author
    And I enter "2022" as the book year
    And I select the genres "Mystery" and "Thriller"
    And I upload a PDF file
    And I click the "Update" button
    Then I should see the book "Book Title" in my collection
    When I click on the book cover
    Then I should see the book details with updated information except title

  Scenario: Update book with description unchanged
    When I hover over the book card
    And I click the edit button
    Then I should see the book form with existing data
    When I enter "Updated Book Title" as the book title
    And I enter "Updated Author Name" as the book author
    And I enter "2022" as the book year
    And I select the genres "Mystery" and "Thriller"
    And I upload a PDF file
    And I click the "Update" button
    Then I should see the book "Updated Book Title" in my collection
    When I click on the book cover
    Then I should see the book details with updated information except description

  Scenario: Update book with author unchanged
    When I hover over the book card
    And I click the edit button
    Then I should see the book form with existing data
    When I enter "Updated Book Title" as the book title
    And I enter "Updated book description" as the book description
    And I enter "2022" as the book year
    And I select the genres "Mystery" and "Thriller"
    And I upload a PDF file
    And I click the "Update" button
    Then I should see the book "Updated Book Title" in my collection
    When I click on the book cover
    Then I should see the book details with updated information except author

  Scenario: Update book with year unchanged
    When I hover over the book card
    And I click the edit button
    Then I should see the book form with existing data
    When I enter "Updated Book Title" as the book title
    And I enter "Updated book description" as the book description
    And I enter "Updated Author Name" as the book author
    And I select the genres "Mystery" and "Thriller"
    And I upload a PDF file
    And I click the "Update" button
    Then I should see the book "Updated Book Title" in my collection
    When I click on the book cover
    Then I should see the book details with updated information except year
