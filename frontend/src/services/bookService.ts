import axios from "axios";
import { Book } from "../types";

// Replace with your backend API URL
const API_URL = "https://localhost:5001/api";

// Modify the return type to include both books and total count
export interface PaginatedBooks {
  books: Book[]; // The array of books for the current page
  totalBooks: number; // Total number of books in the database
}

// Add a new interface for categories
export type Categories = string[]; // Array of category names

// Function to fetch books with pagination and optional category filter
export const getBooks = async (
  page: number = 1,
  pageSize: number = 5,
  category?: string // Optional category filter
): Promise<PaginatedBooks> => {
  try {
    // Build query parameters
    let url = `${API_URL}/books?page=${page}&pageSize=${pageSize}`;
    if (category) {
      url += `&category=${encodeURIComponent(category)}`; // Append category if provided
    }

    const response = await axios.get<PaginatedBooks>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

// Function to fetch categories from the backend API
export const getCategories = async (): Promise<Categories> => {
  try {
    const response = await axios.get<Categories>(`${API_URL}/books/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
