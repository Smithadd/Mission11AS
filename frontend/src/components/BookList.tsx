import React, { useEffect, useState } from "react";
import { getBooks, PaginatedBooks } from "../services/bookService"; // Import updated service
import { Book } from "../types";
import { Table, Pagination } from "react-bootstrap";

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalBooks, setTotalBooks] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Sorting order state

  useEffect(() => {
    fetchBooks();
  }, [currentPage, pageSize, sortOrder]);

  const fetchBooks = async () => {
    try {
      const data: PaginatedBooks = await getBooks(currentPage, pageSize);
      let sortedBooks = [...data.books];

      // Sort books when fetched
      sortedBooks.sort((a, b) =>
        sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      );

      setBooks(sortedBooks);
      setTotalBooks(data.totalBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Handle sorting when clicking "Title" column
  const handleSortChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalBooks / pageSize)) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Book List</h2>

      <label>Results per page: </label>
      <select
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={handleSortChange} style={{ cursor: "pointer" }}>
              Title {sortOrder === "asc" ? "🔼" : "🔽"}
            </th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Pages</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.isbn}</td>
              <td>{book.classification}</td>
              <td>{book.pageCount}</td>
              <td>${book.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        <Pagination.Item>{currentPage}</Pagination.Item>
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage * pageSize >= totalBooks}
        />
      </Pagination>
    </div>
  );
};

export default BookList;
