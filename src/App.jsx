import React, { useEffect, useMemo, useReducer, useState, useRef } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import emailjs from "@emailjs/browser";

const formRef = useRef();
const sendEmail = (e) => {
  e.preventDefault();
  emailjs.sendForm("service_276lrif", "template_bi9mo6r", formRef.current, "0Yq-ibipS04GEC5iq")
    .then(() => alert("✅ অর্ডার সফলভাবে জমা হয়েছে!"))
    .catch(() => alert("❌ অর্ডার পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"));
};


/**
 * An Noor Store — Single-file demo shop
 * - Header & Footer labels remain English per your request.
 * - Mobile menu (☰) is a circular button placed in the header (right side) and opens a small dropdown.
 * - Product specs show to the right (under name & price). Description (বিস্তারিত) appears under images.
 * - Checkout form and payment/area labels are in Bangla.
 */

const BRAND = {
  name: "An Noor Store",
  colors: {
    primary: "#F4EDE6",
    secondary: "#0F2744",
    accent: "#832823",
  },
};

const CONTACTS = {
  phone: "+8801XXXXXXXXX",
  email: "hello@an-noor.example",
  address: "Dhaka, Bangladesh",
  facebook: "https://facebook.com/yourpage",
  instagram: "https://instagram.com/yourhandle",
  twitter: "https://twitter.com/yourhandle",
  whatsapp: "https://wa.me/8801XXXXXXXXX",
};

const CURRENCY = "৳";

const PRODUCTS = [
  {
    id: "watch-arabic-black",
    name: "Arabic Dial — Black",
    mrp: 2990,
    price: 2190,
    images: [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    ],
    specs: ["স্টেইনলেস স্টিল কেস", "মিনারেল গ্লাস", "ওয়াটার রেসিস্ট্যান্ট"],
    short: "Classy everyday watch.",
  },
  {
    id: "watch-arabic-white",
    name: "Arabic Dial — White",
    mrp: 2890,
    price: 1990,
    images: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1200&auto=format&fit=crop",
    ],
    specs: ["লেদার স্ট্র্যাপ", "৩ এটিএম রেটিং", "১ বছরের সার্ভিস সাপোর্ট"],
    short: "Minimal white dial.",
  },
  {
    id: "watch-minimal-silver",
    name: "Minimal Silver",
    mrp: 3190,
    price: 2390,
    images: [
      "https://images.unsplash.com/photo-1524805444752-c63f37f1f59b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
    ],
    specs: ["স্টিল মেশ ব্যান্ড", "কোয়াটজ মুভমেন্ট", "হালকা ওজন"],
    short: "Clean silver finish.",
  },
];

const DELIVERY = {
  insideDhaka: 70,
  outsideDhaka: 130,
};

// ⚠️ Set this to your FormSubmit endpoint (replace with your email)
// Example: "https://formsubmit.co/[email protected]"
const FORMSUBMIT_URL = "https://formsubmit.co/mashrafe327@gmail.com";

// ----------------------
// Cart reducer + hook
// ----------------------
function cartReducer(state, action) {
  switch (action.type) {
    case "INIT":
      return action.payload || [];
    case "ADD": {
      const qty = Math.max(1, parseInt(action.item.qty || 1, 10));
      const exists = state.find((i) => i.id === action.item.id);
      if (exists) return state.map((i) => (i.id === action.item.id ? { ...i, qty: i.qty + qty } : i));
      return [...state, { ...action.item, qty }];
    }
    case "REMOVE":
      return state.filter((i) => i.id !== action.id);
    case "QTY":
      return state.map((i) => (i.id === action.id ? { ...i, qty: Math.max(1, parseInt(action.qty || 1, 10)) } : i));
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

function useCart() {
  const [cart, dispatch] = useReducer(cartReducer, []);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("anNoorCart") || "null");
      if (Array.isArray(saved)) dispatch({ type: "INIT", payload: saved });
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("anNoorCart", JSON.stringify(cart));
    } catch {}
  }, [cart]);
  const subtotal = useMemo(() => cart.reduce((s, i) => s + (Number(i.price) || 0) * i.qty, 0), [cart]);
  const count = useMemo(() => cart.reduce((n, i) => n + i.qty, 0), [cart]);
  return { cart, dispatch, subtotal, count };
}

// ----------------------
// UI primitives
// ----------------------
function Price({ mrp, price }) {
  return (
    <div className="flex gap-2 items-baseline">
      <span className="line-through text-red-500 text-sm">
        {CURRENCY}
        {mrp}
      </span>
      <span className="text-xl font-bold text-gray-900">
        {CURRENCY}
        {price}
      </span>
    </div>
  );
}

function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      style={{ backgroundColor: BRAND.colors.accent }}
      className={`text-white px-5 py-2 rounded-xl shadow hover:opacity-90 transition active:scale-[.98] ${className}`}
    >
      {children}
    </button>
  );
}

function GhostButton({ active = false, children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-xl border transition active:scale-[.98] ${active ? "text-white" : "bg-white"} ${className}`}
      style={
        active
          ? { backgroundColor: BRAND.colors.secondary, borderColor: BRAND.colors.secondary }
          : { color: BRAND.colors.secondary, borderColor: BRAND.colors.secondary }
      }
    >
      {children}
    </button>
  );
}

// ----------------------
// App
// ----------------------
export default function App() {
  const { cart, dispatch, subtotal, count } = useCart();
  const [route, setRoute] = useState({ name: "home" });
  const go = (name, params = {}) => setRoute({ name, ...params });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [route.name]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BRAND.colors.primary }}>
      <Header onNav={go} cartCount={count} route={route.name} />

      {route.name === "home" && <Home onNav={go} />}
      {route.name === "shop" && <Shop onNav={go} />}
      {route.name === "product" && <ProductDetail productId={route.productId} dispatch={dispatch} onNav={go} />}
      {route.name === "checkout" && (
        <CheckoutPage cart={cart} subtotal={subtotal} onNav={go} dispatch={dispatch} />
      )}

      <Footer />
    </div>
  );
}

// ----------------------
// Header (updated: menu button placed in header right side on mobile)
// ----------------------
function Header({ onNav, cartCount, route }) {
  const linkCls = (r) =>
  `px-2 pb-2 border-b-2 transition ${
    route === r
      ? "border-[var(--accent)] text-[var(--accent)]"
      : "border-transparent hover:border-gray-300"
  }`;


  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b"
      style={{ ['--accent']: BRAND.colors.accent, color: BRAND.colors.secondary }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 relative">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="An Noor Store Logo" className="h-10 w-10 object-contain rounded-full" />
<button
            onClick={() => {
              onNav("home");
              setMenuOpen(false);
            }}
            className="font-extrabold text-2xl sm:text-3xl text-left"
            style={{ color: BRAND.colors.secondary }}
          >
            {BRAND.name}
          </button>
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-3 text-sm font-medium">
  <button
    onClick={() => onNav("home")}
    className={linkCls("home")}
    style={route === "home" ? { borderColor: "var(--accent)" } : {}}
  >
    Home
  </button>
  <span className="opacity-40">|</span>

  <button
    onClick={() => onNav("shop")}
    className={linkCls("shop")}
    style={route === "shop" ? { borderColor: "var(--accent)" } : {}}
  >
    Shop
  </button>
  <span className="opacity-40">|</span>

  <button
    onClick={() => onNav("checkout")}
    className={linkCls("checkout")}
    style={route === "checkout" ? { borderColor: "var(--accent)" } : {}}
  >
    Cart ({cartCount})
  </button>
</nav>

        {/* Mobile controls: cart + circular menu button */}
        <div className="sm:hidden flex items-center gap-2">
          <button onClick={() => onNav("checkout")} className="text-lg aria-label:Cart">
            🛒 {cartCount}
          </button>

          <button
            onClick={() => setMenuOpen((s) => !s)}
            className="w-11 h-11 rounded-full bg-white shadow flex items-center justify-center border"
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="absolute right-4 top-full mt-2 bg-white rounded-2xl shadow p-3 sm:hidden z-40">
            <button
              onClick={() => {
                onNav("home");
                setMenuOpen(false);
              }}
              className="block text-right w-full py-2 px-4 hover:bg-gray-50 rounded"
            >
              হোম
            </button>
            <button
              onClick={() => {
                onNav("shop");
                setMenuOpen(false);
              }}
              className="block text-right w-full py-2 px-4 hover:bg-gray-50 rounded"
            >
              দোকান
            </button>
            <button
              onClick={() => {
                onNav("checkout");
                setMenuOpen(false);
              }}
              className="block text-right w-full py-2 px-4 hover:bg-gray-50 rounded"
            >
              কার্ট
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

// ----------------------
// Pages
// ----------------------
function Home({ onNav }) {
  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-3xl font-bold mb-3 text-gray-900">ক্লাসি ওয়াচেস — দৈনন্দিন স্টাইল</h1>
          <p className="mb-6 text-gray-700">Minimal • Premium • Bangla‑first. COD, bKash/Nagad accepted.</p>
          <PrimaryButton onClick={() => onNav("shop")}>পণ্য দেখুন</PrimaryButton>
        </div>
        <div className="rounded-2xl h-60 bg-gray-200" />
      </div>

      <h2 className="text-xl font-semibold mt-12 mb-4">Featured</h2>
      <ProductGrid onNav={onNav} />
    </main>
  );
}

function Shop({ onNav }) {
  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">সব পণ্য</h1>
      <ProductGrid onNav={onNav} />
    </main>
  );
}

function ProductGrid({ onNav }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {PRODUCTS.map((p) => (
        <article key={p.id} className="border rounded-2xl overflow-hidden shadow-sm p-2 bg-white">
          <button onClick={() => onNav("product", { productId: p.id })} className="block w-full">
            <img src={p.images[0]} alt={p.name} className="aspect-square w-full object-cover" />
          </button>
          <div className="p-2 space-y-2">
            <h3 className="font-medium text-gray-800">{p.name}</h3>
            <Price mrp={p.mrp} price={p.price} />
            <PrimaryButton onClick={() => onNav("product", { productId: p.id })} className="text-sm w-full">
              অর্ডার করুন
            </PrimaryButton>
          </div>
        </article>
      ))}
    </div>
  );
}

function ProductDetail({ productId, onNav, dispatch }) {
  const p = PRODUCTS.find((x) => x.id === productId);
  const [qty, setQty] = useState(1);
  const [mainImg, setMainImg] = useState(p?.images?.[0] || "");
  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [productId]);
  if (!p) return null;

  return (
    <main className="max-w-6xl mx-auto py-10 px-4 space-y-10">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Left: images */}
        <div>
          <img src={mainImg} alt={p.name} className="rounded-xl w-full object-cover mb-4" />
          <div className="flex gap-2">
            {p.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="thumb"
                onClick={() => setMainImg(img)}
                className="h-20 w-20 object-cover rounded cursor-pointer border"
              />
            ))}
          </div>
        </div>

        {/* Right: name, price, specs (as requested) and actions */}
        <div>
          <h1 className="text-2xl font-semibold mb-2">{p.name}</h1>
          <Price mrp={p.mrp} price={p.price} />

          {/* Specs under name & price (right side) */}
          <ul className="list-disc list-inside mt-3 mb-4 text-gray-700">
            {p.specs.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-1 border rounded">
                -
              </button>
              <span className="min-w-[2ch] text-center">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3 py-1 border rounded">
                +
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <PrimaryButton
                onClick={() => {
                  dispatch({ type: "ADD", item: { id: p.id, name: p.name, price: p.price, image: p.images[0], qty } });
                  onNav("checkout");
                }}
              >
                অর্ডার করুন
              </PrimaryButton>
              <PrimaryButton
                onClick={() =>
                  dispatch({ type: "ADD", item: { id: p.id, name: p.name, price: p.price, image: p.images[0], qty } })
                }
              >
                Add to Cart
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>

      {/* Description under images (বিস্তারিত) - shows specs as user requested */}
      <div>
        <h2 className="text-xl font-semibold mb-4">বিস্তারিত</h2>
        <ul className="text-gray-700 space-y-1">
          {p.specs.map((s, i) => (
            <li key={i}>• {s}</li>
          ))}
        </ul>
      </div>

      {/* Other products below */}
      <div>
        <h2 className="text-xl font-semibold mb-4">আরও পণ্য</h2>
        <ProductGrid onNav={onNav} />
      </div>
    </main>
  );
}

function LineItem({ item, onQty, onRemove }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
      <div className="flex-1">
        <div className="font-medium text-gray-900">{item.name}</div>
        <div className="text-sm text-gray-600">
          {CURRENCY}
          {item.price} × {item.qty} = {CURRENCY}
          {(Number(item.price) || 0) * item.qty}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <button onClick={() => onQty(item.id, Math.max(1, item.qty - 1))} className="px-2 py-1 border rounded">
            -
          </button>
          <span className="px-2">{item.qty}</span>
          <button onClick={() => onQty(item.id, item.qty + 1)} className="px-2 py-1 border rounded">
            +
          </button>
          <button onClick={() => onRemove(item.id)} className="ml-3 text-red-600 underline">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckoutPage({ cart, subtotal, onNav, dispatch }) {
  const [area, setArea] = useState("inside");
  const [pay, setPay] = useState("COD");
  const [form, setForm] = useState({ name: "", phone: "", address: "", trxId: "", sender: "", notes: "" });

  if (!cart.length)
    return (
      <main className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-semibold mb-4">আপনার কার্ট ও অর্ডার নিশ্চিত করুন</h1>
        <div className="text-gray-700">
          কার্ট খালি।
          <button onClick={() => onNav("shop")} className="underline ml-1">
            শপে যান
          </button>
        </div>
      </main>
    );

  const deliveryFee = area === "inside" ? DELIVERY.insideDhaka : DELIVERY.outsideDhaka;
  const total = subtotal + deliveryFee;

  // FormSubmit: default POST submission and redirect; no JS submit handler needed.

  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">আপনার কার্ট ও অর্ডার নিশ্চিত করুন</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left: Cart items */}
        <section className="md:col-span-2 bg-white rounded-2xl p-4 border">
          <h2 className="text-lg font-semibold mb-4">পণ্যসমূহ</h2>
          <div className="divide-y">
            {cart.map((i) => (
              <LineItem
                key={i.id}
                item={i}
                onQty={(id, qty) => dispatch({ type: "QTY", id, qty })}
                onRemove={(id) => dispatch({ type: "REMOVE", id })}
              />
            ))}
          </div>

          {/* Shipping area selection */}
          <div className="mt-6">
            <div className="mb-2 text-sm text-gray-700">ডেলিভারি এরিয়া</div>
            <div className="flex gap-2">
              <GhostButton active={area === "inside"} onClick={() => setArea("inside")}>
                ঢাকার ভিতরে
              </GhostButton>
              <GhostButton active={area === "outside"} onClick={() => setArea("outside")}>
                ঢাকার বাইরে
              </GhostButton>
            </div>
          </div>

          {/* Payment method selection */}
          <div className="mt-6">
            <div className="mb-2 text-sm text-gray-700">পেমেন্ট পদ্ধতি</div>
            <div className="flex gap-2 flex-wrap">
              <GhostButton active={pay === "bKash"} onClick={() => setPay("bKash")}>
                বিকাশ
              </GhostButton>
              <GhostButton active={pay === "Nagad"} onClick={() => setPay("Nagad")}>
                নগদ
              </GhostButton>
              <GhostButton active={pay === "COD"} onClick={() => setPay("COD")}>
                ক্যাশ অন ডেলিভারি
              </GhostButton>
            </div>
            {pay !== "COD" && (
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                <input
                  value={form.trxId}
                  onChange={(e) => setForm({ ...form, trxId: e.target.value })}
                  placeholder={`Trx ID`}
                  className="border rounded-xl px-3 py-2 w-full"
                />
                <input
                  value={form.sender}
                  onChange={(e) => setForm({ ...form, sender: e.target.value })}
                  placeholder={`প্রেরকের নাম্বার`}
                  className="border rounded-xl px-3 py-2 w-full"
                />
              </div>
            )}
            {pay === "COD" && <p className="text-sm text-gray-600 mt-3">পণ্য পৌঁছালে নগদে পরিশোধ করুন।</p>}
          </div>
        </section>

        {/* Right: Summary & Address */}
        <aside className="md:col-span-1 space-y-6">
          {/* Order form posts to FormSubmit */}

          <form ref={formRef} onSubmit={sendEmail} className="bg-white rounded-2xl p-4 border">
  {/* --- Hidden fields populated from app state --- */}
  <input type="hidden" name="Area" value={area === "inside" ? "Inside Dhaka" : "Outside Dhaka"} />
  <input type="hidden" name="Payment Method" value={pay} />
  <input type="hidden" name="Subtotal" value={subtotal} />
  <input type="hidden" name="Delivery Fee" value={deliveryFee} />
  <input type="hidden" name="Total" value={total} />
  {/* bKash/Nagad extra details (filled only if used) */}
  <input type="hidden" name="Trx ID" value={form.trxId} />
  <input type="hidden" name="Sender Number" value={form.sender} />
  {/* Each cart item as a separate field */}
  {cart.map((i, idx) => (
    <input
      key={i.id}
      type="hidden"
      name={`Item ${idx + 1}`}
      value={`${i.name} x ${i.qty} = ${CURRENCY}${(Number(i.price) || 0) * i.qty}`}
    />
  ))}

  <h3 className="text-lg font-semibold mb-3">শিপিং বিবরণ</h3>
  <div className="space-y-3">
    <input
      name="Name"
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      placeholder="পূর্ণ নাম"
      className="border rounded-xl px-3 py-2 w-full"
      required
    />
    <input
      name="Phone"
      value={form.phone}
      onChange={(e) => setForm({ ...form, phone: e.target.value })}
      placeholder="ফোন নম্বর"
      className="border rounded-xl px-3 py-2 w-full"
      required
    />
    <textarea
      name="Address"
      value={form.address}
      onChange={(e) => setForm({ ...form, address: e.target.value })}
      placeholder="পূর্ণ ঠিকানা"
      className="border rounded-xl px-3 py-2 w-full min-h-[96px]"
      required
    />
    <textarea
      name="Notes"
      value={form.notes}
      onChange={(e) => setForm({ ...form, notes: e.target.value })}
      placeholder="অর্ডার নোট (ঐচ্ছিক)"
      className="border rounded-xl px-3 py-2 w-full min-h-[72px]"
    />
  </div>

  <div className="mt-6 border-t pt-4 space-y-2 text-sm">
    <div className="flex justify-between"><span>সাবটোটাল</span><span>{CURRENCY}{subtotal}</span></div>
    <div className="flex justify-between"><span>ডেলিভারি ফি</span><span>{CURRENCY}{deliveryFee}</span></div>
    <div className="flex justify-between font-semibold text-gray-900 text-base"><span>মোট</span><span>{CURRENCY}{total}</span></div>
  </div>

  <input type="hidden" name="cart" value={JSON.stringify(cart)} />

  <PrimaryButton type="submit" className="w-full mt-4">অর্ডার করুন</PrimaryButton>
</form>

          <div className="bg-white rounded-2xl p-4 border">
            <div className="text-sm text-gray-700 mb-3">আর কিছু যোগ করবেন?</div>
            <PrimaryButton onClick={() => onNav("shop")} className="w-full">শপ চালিয়ে যান</PrimaryButton>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="max-w-6xl mx-auto px-4 py-8 grid sm:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="font-bold text-lg mb-2">{BRAND.name}</div>
          <p className="text-gray-700">Minimal timepieces with Arabic numerals for everyday elegance.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Contact</div>
          <ul className="space-y-1 text-gray-700">
            <li>{CONTACTS.address}</li>
            <li>{CONTACTS.phone}</li>
            <li>{CONTACTS.email}</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Follow</div>
          <div className="flex gap-4 text-xl text-gray-700">
            <a href={CONTACTS.facebook} aria-label="Facebook"><FaFacebook /></a>
            <a href={CONTACTS.instagram} aria-label="Instagram"><FaInstagram /></a>
            <a href={CONTACTS.twitter} aria-label="Twitter"><FaTwitter /></a>
            <a href={CONTACTS.whatsapp} aria-label="WhatsApp"><FaWhatsapp /></a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 pb-6">© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</div>
    </footer>
  );
}

// ----------------------
// Tests
// ----------------------
function runReducerTests() {
  try {
    const add1 = cartReducer([], { type: "ADD", item: { id: "a", price: 100, qty: 1 } });
    console.assert(add1.length === 1 && add1[0].qty === 1, "ADD new item failed");

    const addAgain = cartReducer(add1, { type: "ADD", item: { id: "a", price: 100, qty: 2 } });
    console.assert(addAgain[0].qty === 3, "ADD merge qty failed");

    const setQty = cartReducer(addAgain, { type: "QTY", id: "a", qty: 0 });
    console.assert(setQty[0].qty === 1, "QTY floor at 1 failed");

    const removed = cartReducer(setQty, { type: "REMOVE", id: "a" });
    console.assert(removed.length === 0, "REMOVE failed");

    const cleared = cartReducer([{ id: "x", price: 10, qty: 1 }], { type: "CLEAR" });
    console.assert(Array.isArray(cleared) && cleared.length === 0, "CLEAR failed");

    console.log("Cart reducer tests: ✅ all passed");
  } catch (e) {
    console.warn("Cart reducer tests: ❌", e);
  }
}

if (typeof window !== "undefined") {
  if (!window.__AN_NOOR_TESTED__) {
    window.__AN_NOOR_TESTED__ = true;
    runReducerTests();
  }
}
