import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { HeroBanner, CategorySection } from "@/components/HeroBanner";
import Navbar from "@/components/Navbar";

const Index = () => {
  const featured = products.slice(0, 8);
  const deals = products.filter(p => p.originalPrice).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroBanner />
      <CategorySection />

      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Deals */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-foreground">🔥 Today's Deals</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {deals.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>

        {/* Featured */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-foreground">Featured Products</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      </main>

      <footer className="bg-nav text-nav-foreground/60 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2026 SalesVision. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
