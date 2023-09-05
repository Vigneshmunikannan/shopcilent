import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Category from './Category';
import Cart from './Cart'
import Product from './Product'
import { CartProvider } from './CartContext';
function App() {
  return (
    <div>
    <Router>
      <CartProvider> {/* Wrap your application with CartProvider */}
        <Routes>
          <Route path="/" element={<Category />} />
            <Route path="/add/:category" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
        </Routes>
      </CartProvider>
    </Router>
  </div>
  );
}

export default App;
