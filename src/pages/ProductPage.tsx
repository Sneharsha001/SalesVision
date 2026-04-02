import { useParams, Link } from "react-router-dom";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, Zap } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const ProductPage = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Product not found</h2>
          <Link to="/" className="text-primary hover:underline">Go back home</Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to products
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-8 lg:gap-12"
        >
          {/* Image */}
          <div className="bg-card rounded-2xl overflow-hidden shadow-card aspect-square">
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground leading-tight">{product.title}</h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-success text-success-foreground px-2 py-1 rounded-lg text-sm font-bold">
                {product.rating} <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-sm text-muted-foreground">{product.reviewCount.toLocaleString()} ratings</span>
            </div>

            <div className="flex items-baseline gap-3 py-2">
              <span className="text-3xl font-bold text-foreground">₹{product.price.toLocaleString("en-IN")}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                  <span className="text-sm font-semibold text-destructive">{discount}% off</span>
                </>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {product.specs && (
              <div className="grid grid-cols-2 gap-2 py-4 border-t border-border">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="text-sm">
                    <span className="text-muted-foreground">{k}: </span>
                    <span className="font-medium text-foreground">{v}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 py-2">
              <span className="text-sm font-medium text-foreground">Qty:</span>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-2 hover:bg-muted transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-medium">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="p-2 hover:bg-muted transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={() => addToCart(product, qty)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] shadow-glow"
              >
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
              <Link
                to="/cart"
                onClick={() => addToCart(product, qty)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-all active:scale-[0.98]"
              >
                <Zap className="w-5 h-5" /> Buy Now
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductPage;
