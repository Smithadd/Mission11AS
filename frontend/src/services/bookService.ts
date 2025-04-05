import axios from "axios";
import { Book } from "../types";

const API_URL = "https://localhost:5001/api";

// Response structure for paginated books
export interface PaginatedBooks {
  books: Book[];
  totalBooks: number;
}

export type Categories = string[];

// Get paginated list of books, optionally filtered by category
export const getBooks = async (
  page: number = 1,
  pageSize: number = 5,
  category?: string
): Promise<PaginatedBooks> => {
  try {
    let url = `${API_URL}/books?page=${page}&pageSize=${pageSize}`;
    if (category && category !== "All") {
      url += `&category=${encodeURIComponent(category)}`;
    }

    const response = await axios.get<PaginatedBooks>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

// Get unique book categories
export const getCategories = async (): Promise<Categories> => {
  try {
    const response = await axios.get<Categories>(`${API_URL}/books/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Create a new book
export const createBook = async (book: Book): Promise<void> => {
  try {
    await axios.post(`${API_URL}/books`, book);
  } catch (error) {
    console.error("Error creating book:", error);
    throw error;
  }
};

// Update an existing book
export const updateBook = async (id: number, book: Book): Promise<void> => {
  try {
    await axios.put(`${API_URL}/books/${id}`, book);
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

// Delete a book by ID
export const deleteBook = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/books/${id}`);
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};
