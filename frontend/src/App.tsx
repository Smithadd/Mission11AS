import React, { useEffect } from "react";
import "./App.css";
import BookList from "./components/BookList";

const App: React.FC = () => {
  useEffect(() => {
    document.title = "Bookstore Web App";
  }, []);

  return (
    <div className="App">
      <header className="app-header">
        <h1>Bookstore</h1>
      </header>
      <main>
        {/* Remove the books prop here */}
        <BookList />
      </main>
    </div>
  );
};

export default App;
