import React, { useEffect, useState } from "react";
import {
  getBooks,
  getCategories,
  PaginatedBooks,
} from "../services/bookService";
import { Book } from "../types";
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
  const [pageSize, setPageSize] = useState(5);
  const [totalBooks, setTotalBooks] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [cart, setCart] = useState<any[]>([]); // Cart state
  const [cartVisible, setCartVisible] = useState(false); // Cart visibility toggle

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(["All", ...data]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch books based on category and pagination
  useEffect(() => {
    fetchBooks();
  }, [currentPage, pageSize, sortOrder, category]);

  const fetchBooks = async () => {
    try {
      const data: PaginatedBooks = await getBooks(
        currentPage,
        pageSize,
        category
      );
      let sortedBooks = [...data.books];

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

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  // Add to cart function
  const addToCart = (book: Book) => {
    const existingItem = cart.find((item) => item.id === book.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...book, quantity: 1 }]);
    }
  };

  // Remove from cart function
  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Calculate subtotal and total
  const calculateTotals = () => {
    const subtotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const total = subtotal;
    return { subtotal, total };
  };

  // Continue shopping button
  const continueShopping = () => {
    window.history.back();
  };

  // Calculate total number of items
  const totalItemsInCart = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="container mt-4">
      {/* Row for the main content and cart */}
      <Row>
        <Col md={9}>
          <h2>Book List</h2>

          {/* Category Filter */}
          <Row>
            <Col md={6}>
              <Form.Group controlId="categoryFilter" className="mb-3">
                <Form.Label>Filter by Category:</Form.Label>
                <Form.Select value={category} onChange={handleCategoryChange}>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6} className="text-right">
              <label>Results per page: </label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </Col>
          </Row>

          {/* Book Table */}
          <Table striped bordered hover>
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
                <th>Add to Cart</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publisher}</td>
                  <td>${book.price.toFixed(2)}</td>
                  <td>{book.category}</td>
                  <td>
                    <Button variant="success" onClick={() => addToCart(book)}>
                      Add to Cart
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          <Pagination>
            <Pagination.Prev
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            />
            <Pagination.Item>{currentPage}</Pagination.Item>
            <Pagination.Next
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage * pageSize >= totalBooks}
            />
          </Pagination>
        </Col>

        {/* Cart Section */}
        <Col md={3}>
          <Card>
            <Card.Header>
              <Button
                variant="link"
                onClick={() => setCartVisible(!cartVisible)}
                style={{ width: "100%" }}
              >
                {cartVisible ? "Hide Cart" : "Show Cart"}
              </Button>
            </Card.Header>
            <Collapse in={cartVisible}>
              <div>
                <Card.Body>
                  <h4>Cart Summary</h4>
                  <p>Total Items: {totalItemsInCart}</p>
                  <p>Total Price: ${calculateTotals().total.toFixed(2)}</p>
                  <Button variant="primary" onClick={continueShopping}>
                    Continue Shopping
                  </Button>

                  {/* Cart Items */}
                  <h5>Items in Cart</h5>
                  <ul>
                    {cart.map((item) => (
                      <li key={item.id}>
                        {item.title} - {item.quantity} x $
                        {item.price.toFixed(2)}{" "}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>

                  {/* Total Items and Total Cost at the Bottom */}
                  <div className="mt-3">
                    <h5>Total Items: {totalItemsInCart}</h5>
                    <h5>Total Cost: ${calculateTotals().total.toFixed(2)}</h5>
                  </div>
                </Card.Body>
              </div>
            </Collapse>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BookList;
