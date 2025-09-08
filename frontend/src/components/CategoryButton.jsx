import React from "react";

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

const CategoryButton = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`px-5 py-2 rounded-xl font-semibold shadow transition-all duration-200 ${
            selectedCategory === cat
              ? "bg-blue-600 text-white scale-105"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryButton;
