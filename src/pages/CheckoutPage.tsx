import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { ArrowLeft, CreditCard, Banknote, ShoppingBag, Smartphone, ChevronRight, Check, MapPin, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type PaymentMethod = "upi" | "card" | "cod";
type UpiApp = "gpay" | "phonepe" | "paytm";

const CheckoutPage = () => {
  const { items, totalPrice, placeOrder } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Step management
  const [step, setStep] = useState<1 | 2>(1);

  // Address fields
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");

  // Payment fields
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [upiApp, setUpiApp] = useState<UpiApp>("gpay");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Nothing to checkout</h2>
          <p className="text-muted-foreground mb-6">Add some items to your cart first.</p>
          <Link to="/" className="inline-flex px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const validateAddress = () => {
    if (!name.trim()) { toast.error("Please enter your full name"); return false; }
    if (!phone.trim() || !/^\d{10}$/.test(phone.replace(/\s/g, ""))) { toast.error("Please enter a valid 10-digit phone number"); return false; }
    if (!address.trim() || address.trim().length < 10) { toast.error("Please enter a complete address"); return false; }
    if (!pincode.trim() || !/^\d{6}$/.test(pincode.trim())) { toast.error("Please enter a valid 6-digit pincode"); return false; }
    return true;
  };

  const handleAddressContinue = () => {
    if (!isAuthenticated) {
      toast.error("Please login to place an order");
      navigate("/auth");
      return;
    }
    if (validateAddress()) {
      setStep(2);
    }
  };

  const validatePayment = () => {
    if (paymentMethod === "upi") {
      if (!upiId.trim() || !/^[\w.-]+@[\w]+$/.test(upiId.trim())) {
        toast.error("Please enter a valid UPI ID (e.g. name@upi)");
        return false;
      }
    }
    if (paymentMethod === "card") {
      const cleanCard = cardNumber.replace(/\s/g, "");
      if (!/^\d{16}$/.test(cleanCard)) { toast.error("Please enter a valid 16-digit card number"); return false; }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry.trim())) { toast.error("Please enter expiry as MM/YY"); return false; }
      if (!/^\d{3}$/.test(cardCvv.trim())) { toast.error("Please enter a valid 3-digit CVV"); return false; }
    }
    return true;
  };

  const handlePlaceOrder = () => {
    if (!validatePayment()) return;
    setSubmitting(true);
    setTimeout(() => {
      placeOrder();
      toast.success("Order placed successfully! 🎉");
      navigate("/orders");
    }, 1200);
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const inputClass = "w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  const upiApps: { id: UpiApp; name: string; color: string }[] = [
    { id: "gpay", name: "Google Pay", color: "bg-blue-500" },
    { id: "phonepe", name: "PhonePe", color: "bg-purple-600" },
    { id: "paytm", name: "Paytm", color: "bg-sky-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="text-2xl font-display font-bold text-foreground mb-2">Checkout</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <span className={`flex items-center gap-1.5 font-medium ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
            {step > 1 ? <Check className="w-4 h-4" /> : <MapPin className="w-4 h-4" />} Address
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className={`flex items-center gap-1.5 font-medium ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
            <Wallet className="w-4 h-4" /> Payment
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="address" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="bg-card rounded-xl p-6 shadow-card space-y-4">
                    <h3 className="font-display font-bold text-lg text-card-foreground">Shipping Information</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-card-foreground block mb-1.5">Full Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-card-foreground block mb-1.5">Phone Number</label>
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} placeholder="10-digit mobile number" maxLength={10} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-card-foreground block mb-1.5">Delivery Address</label>
                      <textarea value={address} onChange={e => setAddress(e.target.value)} className={inputClass + " min-h-[80px] resize-none"} placeholder="House/Flat No., Street, City, State" />
                    </div>
                    <div className="sm:w-1/2">
                      <label className="text-sm font-medium text-card-foreground block mb-1.5">Pincode</label>
                      <input type="text" value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))} className={inputClass} placeholder="6-digit pincode" maxLength={6} />
                    </div>
                  </div>
                  <button onClick={handleAddressContinue} className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] shadow-glow">
                    Continue to Payment
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                  {/* Address summary */}
                  <div className="bg-card rounded-xl p-4 shadow-card flex items-start justify-between">
                    <div className="text-sm">
                      <p className="font-medium text-card-foreground">{name}</p>
                      <p className="text-muted-foreground">{address}</p>
                      <p className="text-muted-foreground">PIN: {pincode} · Ph: {phone}</p>
                    </div>
                    <button onClick={() => setStep(1)} className="text-xs text-primary font-medium hover:underline shrink-0">Change</button>
                  </div>

                  {/* Payment method selection */}
                  <div className="bg-card rounded-xl p-6 shadow-card space-y-4">
                    <h3 className="font-display font-bold text-lg text-card-foreground">Payment Method</h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {([
                        { id: "upi" as PaymentMethod, icon: Smartphone, label: "UPI", desc: "Google Pay, PhonePe" },
                        { id: "card" as PaymentMethod, icon: CreditCard, label: "Card", desc: "Credit / Debit" },
                        { id: "cod" as PaymentMethod, icon: Banknote, label: "COD", desc: "Pay on delivery" },
                      ]).map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentMethod(m.id)}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${paymentMethod === m.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}
                        >
                          <m.icon className="w-5 h-5 text-primary shrink-0" />
                          <div>
                            <p className="font-medium text-sm text-card-foreground">{m.label}</p>
                            <p className="text-xs text-muted-foreground">{m.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* UPI details */}
                    <AnimatePresence mode="wait">
                      {paymentMethod === "upi" && (
                        <motion.div key="upi" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                          <div className="flex gap-2">
                            {upiApps.map(app => (
                              <button
                                key={app.id}
                                type="button"
                                onClick={() => setUpiApp(app.id)}
                                className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-medium border-2 transition-all ${upiApp === app.id ? "border-primary bg-primary/5 text-card-foreground" : "border-border text-muted-foreground hover:border-muted-foreground/30"}`}
                              >
                                {app.name}
                              </button>
                            ))}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-card-foreground block mb-1.5">UPI ID</label>
                            <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} className={inputClass} placeholder="yourname@upi" />
                          </div>
                        </motion.div>
                      )}

                      {paymentMethod === "card" && (
                        <motion.div key="card" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                          <div>
                            <label className="text-sm font-medium text-card-foreground block mb-1.5">Card Number</label>
                            <input type="text" value={cardNumber} onChange={e => setCardNumber(formatCardNumber(e.target.value))} className={inputClass} placeholder="1234 5678 9012 3456" maxLength={19} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-card-foreground block mb-1.5">Expiry Date</label>
                              <input type="text" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} className={inputClass} placeholder="MM/YY" maxLength={5} />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-card-foreground block mb-1.5">CVV</label>
                              <input type="password" value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} className={inputClass} placeholder="•••" maxLength={3} />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {paymentMethod === "cod" && (
                        <motion.div key="cod" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">💵 Pay with cash when your order is delivered. No extra charges.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                    className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] shadow-glow disabled:opacity-60"
                  >
                    {submitting ? "Placing Order..." : `Place Order – ₹${totalPrice.toLocaleString("en-IN")}`}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-card rounded-xl p-6 shadow-card h-fit sticky top-24 space-y-4">
            <h3 className="font-display font-bold text-lg text-card-foreground">Order Summary</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-3">
                  <img src={item.product.image} alt={item.product.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-card-foreground line-clamp-1">{item.product.title}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{item.product.price.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-success font-medium">Free</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-bold text-card-foreground text-base">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
