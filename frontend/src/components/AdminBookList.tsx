import React, { useEffect, useState } from "react";
import {
  getBooks,
  getCategories,
  createBook,
  updateBook,
  deleteBook,
  PaginatedBooks,
} from "../services/bookService";
import { Book } from "../types";
import BookFormModal from "./BookFormModal";
import {
  Table,
  Pagination,
  Form,
  Row,
  Col,
  Button,
  Card,
  Collapse,
} from "react-bootstrap";

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalBooks, setTotalBooks] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [cartVisible, setCartVisible] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formBook, setFormBook] = useState<Book>({
    bookId: 0,
    title: "",
    author: "",
    publisher: "",
    price: 0,
    category: "",
    isbn: "",
    classification: "",
    pageCount: 0,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(["All", ...data]);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [currentPage, pageSize, category, sortOrder]);

  const fetchBooks = async () => {
    const data: PaginatedBooks = await getBooks(
      currentPage,
      pageSize,
      category
    );
    const sortedBooks = [...data.books].sort((a, b) =>
      sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );
    setBooks(sortedBooks);
    setTotalBooks(data.totalBooks);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  const addToCart = (book: Book) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.bookId === book.bookId);
      if (exists) {
        return prev.map((item) =>
          item.bookId === book.bookId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...book, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (bookId: number) => {
    setCart((prev) => prev.filter((item) => item.bookId !== bookId));
  };

  const getCartSummary = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalCost = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return { totalItems, totalCost };
  };

  const openCreateModal = () => {
    setEditingBook(null);
    setFormBook({
      bookId: 0,
      title: "",
      author: "",
      publisher: "",
      price: 0,
      category: "",
      isbn: "",
      classification: "",
      pageCount: 0,
    });
    setShowModal(true);
  };

  const handleSaveBook = async () => {
    if (editingBook) {
      await updateBook(editingBook.bookId, formBook);
    } else {
      await createBook(formBook);
    }
    setShowModal(false);
    fetchBooks();
  };

  const handleEditClick = (book: Book) => {
    setEditingBook(book);
    setFormBook(book);
    setShowModal(true);
  };

  const handleDeleteClick = async (bookId: number) => {
    await deleteBook(bookId);
    fetchBooks();
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormBook((prev) => ({
      ...prev,
      [name]: name === "price" || name === "pageCount" ? Number(value) : value,
    }));
  };

  const { totalItems, totalCost } = getCartSummary();

  return (
    <div className="container mt-4">
      <Row>
        <Col md={9}>
          <h2 className="mb-3">Book List</h2>
          <Row className="mb-3 align-items-center">
            <Col md={4}>
              <Form.Select value={category} onChange={handleCategoryChange}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4} className="text-end">
              <Button variant="primary" onClick={openCreateModal}>
                Add Book
              </Button>
            </Col>
          </Row>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  style={{ cursor: "pointer" }}
                >
                  Title {sortOrder === "asc" ? "🔼" : "🔽"}
                </th>
                <th>Author</th>
                <th>Publisher</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.bookId}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publisher}</td>
                  <td>${book.price.toFixed(2)}</td>
                  <td>{book.category}</td>
                  <td>
                    <Button
                      size="sm"
                      onClick={() => addToCart(book)}
                      className="me-2"
                    >
                      Add to Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => handleEditClick(book)}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteClick(book.bookId)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between align-items-center">
            <Pagination>
              <Pagination.Prev
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              />
              <Pagination.Item active>{currentPage}</Pagination.Item>
              <Pagination.Next
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage * pageSize >= totalBooks}
              />
            </Pagination>
            <div>
              <strong>Total Books: {totalBooks}</strong>
            </div>
          </div>
        </Col>

        <Col md={3}>
          <Card>
            <Card.Header>
              <Button
                variant="link"
                onClick={() => setCartVisible(!cartVisible)}
                className="w-100"
              >
                {cartVisible ? "Hide Cart" : "Show Cart"}
              </Button>
            </Card.Header>
            <Collapse in={cartVisible}>
              <div>
                <Card.Body>
                  <h5>Cart Summary</h5>
                  {cart.map((item) => (
                    <div
                      key={item.bookId}
                      className="d-flex justify-content-between mb-2"
                    >
                      <div>
                        {item.title} x {item.quantity}
                        <br />
                        <small>
                          ${(item.price * item.quantity).toFixed(2)}
                        </small>
                      </div>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => removeFromCart(item.bookId)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <hr />
                  <div>
                    <p>
                      <strong>Total Items:</strong> {totalItems}
                    </p>
                    <p>
                      <strong>Total Cost:</strong> ${totalCost.toFixed(2)}
                    </p>
                  </div>
                </Card.Body>
              </div>
            </Collapse>
          </Card>
        </Col>
      </Row>

      <BookFormModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSaveBook}
        book={formBook}
        onChange={handleFormChange}
        isEditing={!!editingBook}
      />
    </div>
  );
};

export default BookList;
