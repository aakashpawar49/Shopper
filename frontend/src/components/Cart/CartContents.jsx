import React from "react";

const CartContents = ({ cart }) => {
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div>
      {cart.products.map((product, index) => (
        <div key={index} className="flex items-center mb-4">
          <img
            src={product.image || "/placeholder.jpg"}
            alt={product.name}
            className="w-16 h-20 object-cover mr-4"
          />
          <div>
            <h4>{product.name}</h4>
            <p>Size: {product.size}</p>
            <p>Color: {product.color}</p>
            <p>Price: ₹{product.price?.toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
