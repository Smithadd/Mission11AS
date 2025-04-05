import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Book } from "../types";

interface Props {
  show: boolean;
  onHide: () => void;
  onSubmit: (book: Book) => void;
  book: Book;
  isEditing?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BookFormModal: React.FC<Props> = ({
  show,
  onHide,
  onSubmit,
  book,
  isEditing = false,
  onChange,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(book);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Edit Book" : "Add Book"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={book.title}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="author">
            <Form.Label>Author</Form.Label>
            <Form.Control
              name="author"
              value={book.author}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="publisher">
            <Form.Label>Publisher</Form.Label>
            <Form.Control
              name="publisher"
              value={book.publisher}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              name="price"
              type="number"
              step="0.01"
              value={book.price.toString()}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              name="category"
              value={book.category}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="isbn">
            <Form.Label>ISBN</Form.Label>
            <Form.Control name="isbn" value={book.isbn} onChange={onChange} />
          </Form.Group>

          <Form.Group controlId="classification">
            <Form.Label>Classification</Form.Label>
            <Form.Control
              name="classification"
              value={book.classification}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group controlId="pageCount">
            <Form.Label>Page Count</Form.Label>
            <Form.Control
              name="pageCount"
              type="number"
              value={book.pageCount.toString()}
              onChange={onChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            {isEditing ? "Update Book" : "Add Book"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default BookFormModal;
