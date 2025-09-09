import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { Edit, Trash2 } from 'lucide-react';

const Dashboard = () => {

  const categories = [
    "ALL",
    "Electronics",
    "Fashion & Apparel",
    "Home & Living",
    "Beauty & Personal Care",
    "Books & Stationery",
    "Sports & Outdoors",
    "Toys & Kids",
    "Automotive & Tools",
    "Grocery & Food",
  ];

  const [editingItemId, setEditingItemId] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user: passedUser } = location.state || {};

  const [user, setUser] = useState(
    passedUser || JSON.parse(localStorage.getItem("user") || "null")
  );

  useEffect(() => {
    if (passedUser) {
      localStorage.setItem("user", JSON.stringify(passedUser));
    }
  }, [passedUser]);


  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters
  const [category, setCategory] = useState("ALL");
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("ALL");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemImage, setNewItemImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch items function
  const fetchItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get("https://astrapeai.onrender.com/api/items/get", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          limit: 6,
          category,
          ...(minRate && { minRate: Number(minRate) }),
          ...(maxRate && { maxRate: Number(maxRate) }),
        },
      });

      setItems(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching items");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (user) fetchItems();
  }, [user, page, category, minRate, maxRate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const handleFilterReset = () => {
    setCategory("ALL");
    setMinRate("");
    setMaxRate("");
    setPage(1);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewItemImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

const [addingItem, setAddingItem] = useState(false);

const handleAddItem = async () => {
  try {
    setAddingItem(true);
    const formData = new FormData();
    formData.append("name", newItemName);
    formData.append("description", newItemDesc);
    formData.append("category", newItemCategory);
    formData.append("price", newItemPrice);
    if (newItemImage) formData.append("image", newItemImage);

    const token = localStorage.getItem("token");

    if (editingItemId) {
      await axios.put(`https://astrapeai.onrender.com/api/items/${editingItemId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Item updated successfully!");
    } else {
      // Add new item
      await axios.post("https://astrapeai.onrender.com/api/items/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Item added successfully!");
    }

    // Reset modal state
    setShowAddModal(false);
    setNewItemName("");
    setNewItemDesc("");
    setNewItemCategory("ALL");
    setNewItemPrice("");
    setNewItemImage(null);
    setImagePreview(null);
    setEditingItemId(null);

    fetchItems(); // Refresh items
  } catch (err) {
    console.error(err);
    toast.error("Failed to add/update item");
  } finally {
    setAddingItem(false);
  }
};



const handleStartEditItem = (item) => {
  setEditingItemId(item._id);
  setNewItemName(item.name);
  setNewItemDesc(item.description);
  setNewItemCategory(item.category);
  setNewItemPrice(item.price);
  setImagePreview(item.imageUrl || null);
  setNewItemImage(null);
  setShowAddModal(true);
};

const handleUpdateItem = async () => {
  if (!editingItemId) return;

  try {
    setAddingItem(true);

    const formData = new FormData();
    formData.append("name", newItemName);
    formData.append("description", newItemDesc);
    formData.append("category", newItemCategory);
    formData.append("price", newItemPrice);

    if (newItemImage) formData.append("image", newItemImage);

    const token = localStorage.getItem("token");

    const response = await axios.put(
      `https://astrapeai.onrender.com/api/items/update/${editingItemId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("Item updated successfully!");
    fetchItems();

    // Reset modal
    setShowAddModal(false);
    setNewItemName("");
    setNewItemDesc("");
    setNewItemCategory("ALL");
    setNewItemPrice("");
    setNewItemImage(null);
    setImagePreview(null);
    setEditingItemId(null);
  } catch (err) {
    console.error("Error updating item:", err.response?.data || err.message);
    toast.error("Failed to update item");
  } finally {
    setAddingItem(false);
  }
};




const handleAddToCart = async (item) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to add items to cart.");
      return;
    }

    const response = await axios.post(
      "https://astrapeai.onrender.com/api/cart/add",
      { itemId: item._id, quantity: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.status === 200) {
      toast.success(`${item.name} added to cart!`);
    } else {
      toast.error("Failed to add item to cart.");
    }
  } catch (err) {
    console.error("Add to cart error:", err.response || err);
    toast.error("Failed to add item to cart.");
  }
};



const handleDeleteItem = async (itemId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this item?");
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to delete items.");
      return;
    }

    const response = await axios.delete(`https://astrapeai.onrender.com/api/items/delete/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200 || response.status === 204) {
      toast.success("Item deleted successfully!");
      fetchItems(); // Refresh items
    } else {
      toast.error("Failed to delete item");
      console.error("Unexpected response:", response);
    }
  } catch (err) {
    console.error("Delete error:", err.response || err);
    toast.error("Failed to delete item. Check console for details.");
  }
};


  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar user={user} onLogout={handleLogout} />

      {/* Admin Add Item Button */}
      {user?.role === "admin" && (
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-end">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
          >
            Add Item +
          </button>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Item</h2>

            <input
              type="text"
              placeholder="Item Name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Description"
              value={newItemDesc}
              onChange={(e) => setNewItemDesc(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Price"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mb-3">
              <label
                htmlFor="fileInput"
                className="inline-flex items-center justify-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full cursor-pointer shadow"
              >
                Choose Image
              </label>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-32 object-cover mb-3 rounded-lg"
              />
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={editingItemId ? handleUpdateItem : handleAddItem} // Calls update or add
                disabled={addingItem}
                className={`px-4 py-2 rounded-lg text-white ${
                    addingItem ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {addingItem ? "Loading..." : editingItemId ? "Update Item" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome, <span className="text-blue-600">{user?.name}</span>
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 items-end">
          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2 rounded-xl font-semibold shadow transition-all duration-200 ${
                  category === cat
                    ? "bg-blue-600 text-white scale-105"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Min Rate"
              value={minRate}
              onChange={(e) => setMinRate(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max Rate"
              value={maxRate}
              onChange={(e) => setMaxRate(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleFilterReset}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Items grid */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">
            Available Items
          </h2>
          {loading ? (
            <p className="text-center py-6 text-gray-500">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-center py-6 text-gray-500">No items found</p>
          ) : (
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <li
                  key={item._id}
                  className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow hover:shadow-md transition relative"
                >
                  {/* Image */}
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-md mb-3"
                    />
                  )}

                  <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                  <p className="mt-2 text-sm text-gray-600">Rate: ${item.price}</p>
                  {item.category && (
                    <p className="mt-1 text-sm text-gray-500">Category: {item.category}</p>
                  )}

                  {/* Add to Cart button (all users) */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold rounded-lg shadow transition"
                  >
                    Add to Cart
                  </button>

                  {/* Admin Controls */}
                  {user?.role === "admin" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleStartEditItem(item)}
                        className="px-3 py-1 bg-blue-400 hover:bg-yellow-500 text-white rounded-lg shadow"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Pagination numbers */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-lg ${
                  page === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;