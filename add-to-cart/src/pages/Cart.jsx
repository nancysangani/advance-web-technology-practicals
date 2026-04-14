import React, { useContext, useMemo } from "react";
import CartContext from "../CartContext.jsx";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart } = useContext(CartContext);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  }, [cart]);

  return (
    <div className="page">
      <h1 className="page-title">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p className="empty-icon">🛒</p>
          <p>Your cart is empty!</p>
          <Link to="/" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="cart-thumb"
                  />
                )}
                <div className="cart-item-info">
                  <h3 className="product-name">{item.name}</h3>
                  <p className="product-price">₹{item.price}</p>
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <span>Total:</span>
            <span className="total-amount">₹{total}</span>
          </div>
        </>
      )}
    </div>
  );
}
