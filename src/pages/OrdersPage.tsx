import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import { Package, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const OrdersPage = () => {
  const { orders } = useCart();

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">Your order history will appear here.</p>
          <Link to="/" className="inline-flex px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-2xl font-display font-bold text-foreground mb-6">Your Orders</h1>
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-card rounded-xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-border flex flex-wrap gap-4 justify-between items-center bg-muted/50">
                <div className="flex flex-wrap gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">Order ID</span>
                    <p className="font-semibold text-card-foreground">{order.id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date</span>
                    <p className="font-semibold text-card-foreground">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total</span>
                    <p className="font-semibold text-card-foreground">₹{order.total.toLocaleString("en-IN")}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold capitalize">
                  {order.status}
                </span>
              </div>
              <div className="p-4 space-y-3">
                {order.items.map(item => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <img src={item.product.image} alt={item.product.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">{item.product.title}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{item.product.price.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
