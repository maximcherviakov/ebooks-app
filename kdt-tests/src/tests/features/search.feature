Feature: Search and Filter Books
  As a user
  I want to search and filter books
  So that I can find specific books quickly

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

  Scenario: Search for book by title
    When I click on the search field
    And I enter the book title in the search field
    And I press Enter
    Then I should see search results containing my book

  Scenario: Filter books by genre
    When I navigate to the "Ebooks" catalog
    And I click the "More..." link
    And I select "Science Fiction" from the genre filter
    And I click the "Apply" button
    Then I should see search results containing my book

  Scenario: Filter books by author
    When I navigate to the "Ebooks" catalog
    And I click the "More..." link
    And I enter the book author in the author filter
    And I click the "Apply" button
    Then I should see search results containing my book

  Scenario: Filter books by year
    When I navigate to the "Ebooks" catalog
    And I click the "More..." link
    And I enter the book year in the year filter
    And I click the "Apply" button
    Then I should see search results containing my book
