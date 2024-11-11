import { useEffect, useState } from "react";
import { Book } from "../../app/models/book";
import agent from "../../app/api/agent";

const Catalog = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    agent.Book.list()
      .then((response) => {
        setBooks(response);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <div>Catalog</div>
      <div>
        {books.map((book) => (
          <div key={book._id}>
            <div>{book.title}</div>
            <div>{book.description}</div>
            <div>{book.author}</div>
            <div>{book.bookName}</div>
            <div>{book.thumbnailName}</div>
            <div>{book.user}</div>
            <div>{book.createdAt}</div>
            <div>{book.updatedAt}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
