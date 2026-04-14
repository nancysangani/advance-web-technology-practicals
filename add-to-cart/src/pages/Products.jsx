import React, { useContext, useEffect, useState, useCallback } from "react";
import CartContext from "../CartContext.jsx";

const LIMIT = 12;

export default function Products() {
  const { addToCart, cart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(LIMIT); // starts at 12 after initial load
  const [hasMore, setHasMore] = useState(true);

  // Initial load — fetch logic lives directly inside useEffect
  useEffect(() => {
    fetch(
      `https://dummyjson.com/products?limit=${LIMIT}&skip=0&select=id,title,price,thumbnail,category`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data.products);
        setHasMore(LIMIT < data.total);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []); // empty deps = runs once on mount, no warning

  // Load more — a plain event handler, NOT inside useEffect
  const handleLoadMore = useCallback(() => {
    setLoadingMore(true);
    fetch(
      `https://dummyjson.com/products?limit=${LIMIT}&skip=${skip}&select=id,title,price,thumbnail,category`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts((prev) => [...prev, ...data.products]);
        setHasMore(skip + LIMIT < data.total);
        setSkip((prev) => prev + LIMIT);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingMore(false));
  }, [skip]);

  const isInCart = (id) => cart.some((item) => item.id === id);

  if (loading) return <div className="status-msg">⏳ Loading products...</div>;
  if (error) return <div className="status-msg error">❌ Error: {error}</div>;

  return (
    <div className="page">
      <h1 className="page-title">Our Products</h1>
      <p className="product-count">{products.length} items loaded</p>

      <div className="product-grid">
        {products.map((product) => {
          const inCart = isInCart(product.id);
          return (
            <div key={product.id} className="product-card">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="product-img"
              />
              <span className="product-category">{product.category}</span>
              <h3 className="product-name">{product.title}</h3>
              <p className="product-price">₹{product.price}</p>
              <button
                className={`btn ${inCart ? "btn-added" : "btn-primary"}`}
                onClick={() =>
                  addToCart({
                    id: product.id,
                    name: product.title,
                    price: product.price,
                    thumbnail: product.thumbnail,
                  })
                }
                disabled={inCart}
              >
                {inCart ? "✓ In Cart" : "Add to Cart"}
              </button>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="load-more-wrapper">
          <button
            className="btn btn-outline"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load More Products"}
          </button>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <p className="end-msg">✅ You've seen all products!</p>
      )}
    </div>
  );
}