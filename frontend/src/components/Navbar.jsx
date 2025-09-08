import React, { useState, useRef, useEffect } from "react";
import { ShoppingCart, User, LogOut, Search, Sparkles } from "lucide-react";

/**
 * Props: ( i need to mention i am not using user context here... will use it later according to requirement )
 * - user: { _id, name, email, role, avatarUrl? }
 * - cartItems: array of { _id, name, qty, price }
 * - onLogout: () => void
 * - onOpenCart: () => void (optional)
 */
const Navbar = ({ user = null, cartItems = [], onLogout = () => {}, onOpenCart = () => {} }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // close dropdowns on outside click
  const profileRef = useRef(null);
  const cartRef = useRef(null);
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (cartRef.current && !cartRef.current.contains(e.target)) setCartOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const totalCount = cartItems.reduce((s, i) => s + (i.qty || 1), 0);
  const totalPrice = cartItems.reduce((s, i) => s + (i.qty || 1) * (i.price || 0), 0);

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => (window.location.href = "/")}>
              <div className="rounded-full bg-gradient-to-tr from-violet-500 to-blue-400 p-1.5">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <div className="text-lg font-bold leading-none text-gray-900">Astrape <span className="text-violet-600">AI</span></div>
                <div className="text-xs text-gray-400 -mt-0.5">Smart. Fast. Simple.</div>
              </div>
            </div>
          </div>


          {/* Right: Cart and Profile */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <div className="relative" ref={cartRef}>
              <button
                onClick={() => { setCartOpen(!cartOpen); onOpenCart(); }}
                aria-expanded={cartOpen}
                aria-label="Open cart"
                className="relative p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <ShoppingCart size={20} className="text-gray-700" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-500 text-white">
                    {totalCount}
                  </span>
                )}
              </button>

              {/* Cart dropdown */}
              {cartOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">Your Cart</h4>
                      <span className="text-sm text-gray-500">{cartItems.length} items</span>
                    </div>

                    {cartItems.length === 0 ? (
                      <div className="py-6 text-center text-gray-500">Your cart is empty</div>
                    ) : (
                      <ul className="space-y-3 max-h-60 overflow-auto pr-2">
                        {cartItems.map((it) => (
                          <li key={it._id} className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-sm text-gray-600">
                              {it.name?.charAt(0)?.toUpperCase() || "I"}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-800">{it.name}</div>
                              <div className="text-xs text-gray-500">
                                {it.qty || 1} × ${it.price?.toFixed?.(2) ?? it.price}
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-gray-800">${((it.qty || 1) * (it.price || 0)).toFixed(2)}</div>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-4 border-t pt-3 flex items-center justify-between">
                      <div className="text-sm text-gray-600">Total</div>
                      <div className="text-sm font-semibold text-gray-800">${totalPrice.toFixed(2)}</div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button onClick={() => { /* go to cart page */ }} className="flex-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium">View cart</button>
                      <button onClick={() => { /* checkout */ }} className="flex-1 px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium">Checkout</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

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
                  <span className="text-sm font-medium text-gray-800">{user?.name || "Guest"}</span>
                  <span className="text-xs text-gray-500">{user?.role || "Visitor"}</span>
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
                        <div className="text-sm font-semibold text-gray-900">{user?.name || "Guest User"}</div>
                        <div className="text-xs text-gray-500">{user?.email || "Not signed in"}</div>
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
                        <LogOut size={16} /> <span className="text-sm">Logout</span>
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
