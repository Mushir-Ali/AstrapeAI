import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You must be logged in to view your cart.");
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:4000/api/cart/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems(response.data.items || []);
    } catch (err) {
      console.error("Fetch cart error:", err);
      toast.error("Error loading cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        "http://localhost:4000/api/cart/update",
        { itemId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error("Update cart error:", err);
      toast.error("Failed to update quantity");
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:4000/api/cart/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems([]);
      toast.success("Cart cleared!");
    } catch (err) {
      console.error("Clear cart error:", err);
      toast.error("Failed to clear cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">🛒 Your Cart</h1>

          <div className="flex gap-3">
            {/* Back Button */}
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
            >
              ← Back
            </button>

            {/* Delete Cart Button */}
            <button
              onClick={handleClearCart}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              Delete Cart
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((cartItem) => (
              <div
                key={cartItem._id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
              >
                <div className="flex items-center gap-4">
                  {cartItem.itemId?.imageUrl && (
                    <img
                      src={cartItem.itemId.imageUrl}
                      alt={cartItem.itemId.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  )}
                  <div>
                    <h2 className="text-lg font-semibold">
                      {cartItem.itemId?.name}
                    </h2>
                    <p className="text-gray-600">
                      ${cartItem.itemId?.price} × {cartItem.quantity}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(cartItem.itemId._id, cartItem.quantity - 1)
                    }
                    className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded-lg"
                  >
                    -
                  </button>
                  <span className="px-4">{cartItem.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(cartItem.itemId._id, cartItem.quantity + 1)
                    }
                    className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            {/* Cart total */}
            <div className="text-right font-bold text-xl mt-6">
              Total: $
              {cartItems.reduce(
                (acc, item) => acc + item.itemId.price * item.quantity,
                0
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
