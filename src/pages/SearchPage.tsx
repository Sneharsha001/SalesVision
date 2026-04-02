import { useSearchParams, Link } from "react-router-dom";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import { ArrowLeft, SlidersHorizontal, SearchX, Star, X } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RATING_OPTIONS = [4, 3, 2, 1];

const SearchPage = () => {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const categoryParam = params.get("category") || "";

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000]);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState<string>("relevance");

  const filtered = useMemo(() => {
    let result = products.filter(p => {
      const matchQuery = !query || p.title.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase());
      const matchCategory = !selectedCategory || p.category === selectedCategory;
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchRating = p.rating >= minRating;
      return matchQuery && matchCategory && matchPrice && matchRating;
    });

    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "popularity": result.sort((a, b) => b.reviewCount - a.reviewCount); break;
    }

    return result;
  }, [query, selectedCategory, priceRange, minRating, sortBy]);

  const activeFilterCount = (selectedCategory ? 1 : 0) + (minRating > 0 ? 1 : 0) + (priceRange[1] < 150000 ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategory("");
    setPriceRange([0, 150000]);
    setMinRating(0);
    setSortBy("relevance");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {query ? `Results for "${query}"` : selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : "All Products"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{filtered.length} products found</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popularity">Most Popular</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors relative"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 260 }}
                exit={{ opacity: 0, width: 0 }}
                className="shrink-0 overflow-hidden hidden md:block"
              >
                <div className="w-[260px] bg-card rounded-xl p-5 shadow-card space-y-6 sticky top-24">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-card-foreground">Filters</h3>
                    {activeFilterCount > 0 && (
                      <button onClick={clearFilters} className="text-xs text-primary hover:underline flex items-center gap-1">
                        <X className="w-3 h-3" /> Clear all
                      </button>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                    <div className="space-y-1.5">
                      <button
                        onClick={() => setSelectedCategory("")}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCategory ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-muted"}`}
                      >
                        All Categories
                      </button>
                      {categories.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedCategory(c.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === c.id ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-muted"}`}
                        >
                          {c.icon} {c.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Price Range
                    </label>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>₹{priceRange[0].toLocaleString("en-IN")}</span>
                      <span>₹{priceRange[1].toLocaleString("en-IN")}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="150000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={e => setPriceRange([0, Number(e.target.value)])}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Customer Rating</label>
                    <div className="space-y-1.5">
                      <button
                        onClick={() => setMinRating(0)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${minRating === 0 ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-muted"}`}
                      >
                        All Ratings
                      </button>
                      {RATING_OPTIONS.map(r => (
                        <button
                          key={r}
                          onClick={() => setMinRating(r)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5 ${minRating === r ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-muted"}`}
                        >
                          {r} <Star className="w-3 h-3 fill-current" /> & above
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filters */}
            {showFilters && (
              <div className="md:hidden bg-card rounded-xl p-4 shadow-card mb-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setSelectedCategory("")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!selectedCategory ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>All</button>
                  {categories.map(c => (
                    <button key={c.id} onClick={() => setSelectedCategory(c.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedCategory === c.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {c.icon} {c.name}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <select value={minRating} onChange={e => setMinRating(Number(e.target.value))} className="px-3 py-1.5 border border-border rounded-lg text-xs bg-background text-foreground">
                    <option value={0}>All Ratings</option>
                    {RATING_OPTIONS.map(r => <option key={r} value={r}>{r}★ & up</option>)}
                  </select>
                  <span className="text-xs text-muted-foreground">Max: ₹{priceRange[1].toLocaleString("en-IN")}</span>
                  <input type="range" min="0" max="150000" step="1000" value={priceRange[1]} onChange={e => setPriceRange([0, Number(e.target.value)])} className="w-32 accent-primary" />
                </div>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <SearchX className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-foreground mb-2">No products found</h2>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filters.</p>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
