Feature: Create Books
  As a registered user
  I want to add new books to my collection
  So that I can manage my ebook library

  Background:
    Given I have a registered user account
    And I am logged in with my credentials

  Scenario: Add new book with valid data
    When I navigate to the books page
    And I click the "Add book" link
    And I enter "The Book Title" as the book title
    And I enter "This is a book description" as the book description
    And I enter "John Doe" as the book author
    And I enter "2023" as the book year
    And I select the genres "Science Fiction" and "Fantasy"
    And I upload a PDF file
    And I click the "Add new book" button
    Then I should see the book "The Book Title" in my collection
    And I should be able to view the book details
    And I should be able to download or read the book online
    And I should be able to delete the book

  Scenario: Add new book with valid data without description
    When I navigate to the books page
    And I click the "Add book" link
    And I enter "The Book Title" as the book title
    And I enter "John Doe" as the book author
    And I enter "2023" as the book year
    And I select the genres "Science Fiction" and "Fantasy"
    And I upload a PDF file
    And I click the "Add new book" button
    Then I should see the book "The Book Title" in my collection
    And I should be able to view the book details
    And I should be able to download or read the book online
    And I should be able to delete the book

  Scenario: Add new book with invalid data - title is empty
    When I navigate to the books page
    And I click the "Add book" link
    And I enter "This is a book description" as the book description
    And I enter "John Doe" as the book author
    And I enter "2023" as the book year
    And I select the genres "Science Fiction" and "Fantasy"
    And I upload a PDF file
    And I click the "Add new book" button
    Then I should see an error message "Title is required"
    And I should stay on the book creation page

  Scenario: Add new book with invalid data - author is empty
    When I navigate to the books page
    And I click the "Add book" link
    And I enter "The Book Title" as the book title
    And I enter "This is a book description" as the book description
    And I enter "2023" as the book year
    And I select the genres "Science Fiction" and "Fantasy"
    And I upload a PDF file
    And I click the "Add new book" button
    Then I should see an error message "Author is required"
    And I should stay on the book creation page

  Scenario: Add new book with invalid data - year is empty
    When I navigate to the books page
    And I click the "Add book" link
    And I enter "The Book Title" as the book title
    And I enter "This is a book description" as the book description
    And I enter "John Doe" as the book author
    And I select the genres "Science Fiction" and "Fantasy"
    And I upload a PDF file
    And I click the "Add new book" button
    Then I should see an error message "Year is required"
    And I should stay on the book creation page

  Scenario: Add new book with invalid data - genres are empty
    When I navigate to the books page
    And I click the "Add book" link
    And I enter "The Book Title" as the book title
    And I enter "This is a book description" as the book description
    And I enter "John Doe" as the book author
    And I enter "2023" as the book year
    And I upload a PDF file
    And I click the "Add new book" button
    Then I should see a text message "At least one genre is required"
    And I should stay on the book creation page

  Scenario: Add new book with invalid data - no file
    When I navigate to the books page
    And I click the "Add book" link
    And I enter "The Book Title" as the book title
    And I enter "This is a book description" as the book description
    And I enter "John Doe" as the book author
    And I enter "2023" as the book year
    And I select the genres "Science Fiction" and "Fantasy"
    And I click the "Add new book" button
    Then I should see a text message "File is required"
    And I should stay on the book creation page
