import React, { useState, useRef, useEffect } from "react";
import { ShoppingCart, User, LogOut, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Props:
 * - user: { _id, name, email, role, avatarUrl? }
 * - cartItems: array of { _id, name, qty, price }
 * - onLogout: () => void
 */
const Navbar = ({ user = null, cartItems = [], onLogout = () => {} }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const profileRef = useRef(null);

  // close profile dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const totalCount = cartItems.reduce((s, i) => s + (i.qty || 1), 0);

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="rounded-full bg-gradient-to-tr from-violet-500 to-blue-400 p-1.5">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <div className="text-lg font-bold leading-none text-gray-900">
                Astrape <span className="text-violet-600">AI</span>
              </div>
              <div className="text-xs text-gray-400 -mt-0.5">
                Smart. Fast. Simple.
              </div>
            </div>
          </div>

          {/* Right: Cart and Profile */}
          <div className="flex items-center gap-4">
            {/* Cart (no dropdown, just navigate) */}
            <button
              onClick={() => navigate("/cart")}
              aria-label="Go to cart"
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <ShoppingCart size={20} className="text-gray-700" />

              {/* Gradient text */}
              <span className="bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent font-semibold">
                View Cart
              </span>
            </button>


            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center text-white">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-sm font-medium text-gray-800">
                    {user?.name || "Guest"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user?.role || "Visitor"}
                  </span>
                </div>
              </button>

              {/* Profile dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                  <div className="p-4">
                    <div className="flex items-center gap-3 pb-3 border-b">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg text-gray-700">
                        {user?.name?.charAt(0)?.toUpperCase() || <User size={18} />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {user?.name || "Guest User"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user?.email || "Not signed in"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
