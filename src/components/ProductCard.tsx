import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

interface Props {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: Props) => {
  const { addToCart } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col"
    >
      <Link to={`/product/${product.id}`} className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-full">
            -{discount}%
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <Link to={`/product/${product.id}`} className="font-medium text-sm text-card-foreground line-clamp-2 hover:text-primary transition-colors leading-snug">
          {product.title}
        </Link>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 bg-success text-success-foreground px-1.5 py-0.5 rounded text-xs font-bold">
            {product.rating} <Star className="w-3 h-3 fill-current" />
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount.toLocaleString()})</span>
        </div>

        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-lg font-bold text-card-foreground">₹{product.price.toLocaleString("en-IN")}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
          )}
        </div>

        <button
          onClick={(e) => { e.preventDefault(); addToCart(product); }}
          className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors active:scale-[0.98]"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
