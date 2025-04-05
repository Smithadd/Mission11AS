import React, { useEffect } from "react";
import "./App.css";
import BookList from "./components/BookList";
import AdminBookList from "./components/AdminBookList";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const App: React.FC = () => {
  useEffect(() => {
    document.title = "Bookstore Web App";
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>Bookstore</h1>
          <nav>
            <Link to="/" className="me-3">
              Home
            </Link>
            <Link to="/adminbooks">Admin</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/adminbooks" element={<AdminBookList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
