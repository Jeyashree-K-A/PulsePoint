// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContent";
import SearchResults from "./pages/SearchResults";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import CartPage from "./pages/CartPage";
import OrderHistory from "./pages/OrderHistory";
import AdminPanel from "./pages/AdminPanel"; // ✅ Import Admin Panel

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/admin" element={<AdminPanel />} /> {/* ✅ Admin Route */}
      </Routes>
      <Footer />
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
