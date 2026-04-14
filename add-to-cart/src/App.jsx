import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Cart from "./pages/Cart.jsx";
import Products from "./pages/Products.jsx";
import CartProvider from "./CartProvider.jsx";
import { useContext } from "react";
import CartContext from "./CartContext.jsx";

function Navbar() {
  const { cart } = useContext(CartContext);
  return (
    <nav className="navbar">
      <span className="navbar-brand">🛍 ShopCart</span>
      <div className="nav-links">
        <Link to="/" className="nav-link">Products</Link>
        <Link to="/cart" className="nav-link">
          Cart
          {cart.length > 0 && (
            <span className="cart-badge">{cart.length}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>
      </BrowserRouter>
    </CartProvider>
  );
}