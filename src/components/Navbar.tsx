import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, User, Menu, X, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { totalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setMobileOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-nav text-nav-foreground shadow-lg">
      <div className="container mx-auto flex items-center gap-4 py-3 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-nav-accent flex items-center justify-center font-display font-bold text-primary-foreground text-sm">
            SV
          </div>
          <span className="font-display font-bold text-lg hidden sm:block">SalesVision</span>
        </Link>

        {/* Search - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
          <div className="flex w-full rounded-lg overflow-hidden">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products, brands, categories..."
              className="flex-1 px-4 py-2.5 text-foreground bg-card text-sm focus:outline-none"
            />
            <button type="submit" className="px-5 bg-primary hover:bg-primary/90 transition-colors">
              <Search className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2 ml-auto">
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-nav-foreground/70">Hi, {user?.name}</span>
              <button onClick={logout} className="text-xs text-nav-foreground/70 hover:text-nav-foreground transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-nav-foreground/10 transition-colors text-sm">
              <User className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}

          <Link to="/orders" className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-nav-foreground/10 transition-colors text-sm">
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Orders</span>
          </Link>

          <Link to="/cart" className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-nav-foreground/10 transition-colors text-sm">
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-nav-foreground/10">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-nav-foreground/10"
          >
            <form onSubmit={handleSearch} className="p-4 flex gap-2">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2.5 rounded-lg text-foreground bg-card text-sm focus:outline-none"
              />
              <button type="submit" className="px-4 py-2.5 bg-primary rounded-lg">
                <Search className="w-4 h-4 text-primary-foreground" />
              </button>
            </form>
            {!isAuthenticated && (
              <div className="px-4 pb-4">
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="block w-full text-center py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                  Login / Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
