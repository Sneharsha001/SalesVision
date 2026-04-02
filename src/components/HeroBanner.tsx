import { Link } from "react-router-dom";
import { categories } from "@/data/products";

const HeroBanner = () => (
  <section className="relative bg-gradient-to-br from-nav to-accent overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.2),transparent_70%)]" />
    <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-nav-foreground leading-tight mb-4">
          Shop Smarter.<br />
          <span className="text-primary">Live Better.</span>
        </h1>
        <p className="text-nav-foreground/70 text-lg mb-8 max-w-lg">
          Discover thousands of products at unbeatable prices. Free shipping on orders over ₹4,000.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/search"
            className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-glow active:scale-[0.98]"
          >
            Shop Now
          </Link>
          <Link
            to="/search?category=electronics"
            className="px-8 py-3 bg-nav-foreground/10 text-nav-foreground font-semibold rounded-xl hover:bg-nav-foreground/20 transition-all backdrop-blur-sm border border-nav-foreground/10"
          >
            Explore Deals
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const CategorySection = () => (
  <section className="container mx-auto px-4 -mt-8 relative z-20">
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {categories.map(cat => (
        <Link
          key={cat.id}
          to={`/search?category=${cat.id}`}
          className="glass rounded-xl p-4 text-center hover:shadow-card-hover transition-all group"
        >
          <span className="text-2xl md:text-3xl block mb-1.5 group-hover:scale-110 transition-transform">{cat.icon}</span>
          <span className="text-xs md:text-sm font-medium text-foreground">{cat.name}</span>
        </Link>
      ))}
    </div>
  </section>
);

export { HeroBanner, CategorySection };
