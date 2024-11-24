import { Book } from "./book";

export interface MetaData {
  currentPage: number;
  totalPages: number;
  totalBooks: number;
}

export interface PaginatedResponse {
  books: Book[];
  metadata: MetaData;
}
