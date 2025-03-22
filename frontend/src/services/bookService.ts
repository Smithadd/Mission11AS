import axios from "axios";
import { Book } from "../types";

// Replace with your backend API URL
const API_URL = "https://localhost:5001/api";

// Modify the return type to include both books and total count
export interface PaginatedBooks {
  books: Book[]; // The array of books for the current page
  totalBooks: number; // Total number of books in the database
}

export const getBooks = async (
  page: number = 1,
  pageSize: number = 5
): Promise<PaginatedBooks> => {
  try {
    // Make the GET request to the backend with pagination parameters
    const response = await axios.get<PaginatedBooks>(
      `${API_URL}/books?page=${page}&pageSize=${pageSize}`
    );
    return response.data; // This should return both books and totalBooks
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error; // Handle the error as needed
  }
};
