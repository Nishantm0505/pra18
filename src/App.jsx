
import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Settings,
  Search,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Boxes,
  Pencil,
  Check,
  X,
  Sparkles,
  IndianRupee,
  Layers,
  RotateCcw,
  CircleCheck,
} from "lucide-react";

const initialProducts = [
  { id: 101, name: "AirPods Pro", category: "Electronics", price: 24999, stock: 24, sku: "EL-101", color: "from-violet-500 to-indigo-600", icon: "🎧" },
  { id: 102, name: "Minimal Backpack", category: "Accessories", price: 1899, stock: 42, sku: "AC-102", color: "from-orange-400 to-rose-500", icon: "🎒" },
  { id: 103, name: "Smart Watch X", category: "Electronics", price: 7999, stock: 15, sku: "EL-103", color: "from-cyan-400 to-blue-600", icon: "⌚" },
  { id: 104, name: "Urban Sneakers", category: "Fashion", price: 3299, stock: 31, sku: "FA-104", color: "from-emerald-400 to-teal-600", icon: "👟" },
  { id: 105, name: "Ceramic Coffee Mug", category: "Home", price: 499, stock: 68, sku: "HM-105", color: "from-amber-400 to-orange-600", icon: "☕" },
  { id: 106, name: "Wireless Keyboard", category: "Electronics", price: 1599, stock: 8, sku: "EL-106", color: "from-fuchsia-500 to-purple-600", icon: "⌨️" },
];

const emptyForm = {
  name: "",
  category: "Electronics",
  price: "",
  stock: "",
  sku: "",
};

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function App() {
  const [products, setProducts] = useState(initialProducts);
  const [selectedId, setSelectedId] = useState(101);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [form, setForm] = useState({ ...initialProducts[0] });
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("Products");
  const [history, setHistory] = useState([]);

  const selectedProduct = products.find((p) => p.id === selectedId);

  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
          categoryFilter === "All" || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
      }),
    [products, search, categoryFilter]
  );

  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const lowStock = products.filter((p) => p.stock < 10).length;

  function selectProduct(product) {
    setSelectedId(product.id);
    setForm({ ...product });
    setMessage("");
  }

  function updateField(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setMessage("");
  }

  function handleUpdate(event) {
    event.preventDefault();

    const name = form.name.trim();
    const sku = form.sku.trim();

    if (!name || !sku || form.price === "" || form.stock === "") {
      setMessage("Please fill in every field before updating.");
      return;
    }

    if (Number(form.price) < 0 || Number(form.stock) < 0) {
      setMessage("Price and stock cannot be negative.");
      return;
    }

    if (
      products.some(
        (p) => p.id !== selectedId && p.sku.toLowerCase() === sku.toLowerCase()
      )
    ) {
      setMessage("This SKU already belongs to another product.");
      return;
    }

    const updatedProduct = {
      ...selectedProduct,
      ...form,
      name,
      sku,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    setHistory((previous) => [
      {
        id: selectedId,
        before: { ...selectedProduct },
        after: { ...updatedProduct },
      },
      ...previous,
    ]);

    setProducts((previous) =>
      previous.map((p) => (p.id === selectedId ? updatedProduct : p))
    );
    setForm({ ...updatedProduct });
    setMessage(`Successfully updated "${name}"!`);
  }

  function undoUpdate() {
    if (!history.length) return;

    const lastChange = history[0];
    setProducts((previous) =>
      previous.map((p) => (p.id === lastChange.id ? lastChange.before : p))
    );

    if (selectedId === lastChange.id) {
      setForm({ ...lastChange.before });
    }

    setHistory((previous) => previous.slice(1));
    setMessage("Previous update has been restored.");
  }

  const categories = ["All", "Electronics", "Accessories", "Fashion", "Home"];

  return (
    <div className="min-h-screen bg-[#f5f6fa] text-slate-800">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col bg-[#17182b] p-6 text-white lg:flex">
          <div className="mb-12 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg shadow-violet-500/30">
              <ShoppingBag size={23} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight">
                NEXUS<span className="text-violet-400">.</span>
              </h1>
              <p className="text-xs text-slate-400">Inventory Studio</p>
            </div>
          </div>

          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            Workspace
          </p>

          <nav className="space-y-2">
            {[
              { name: "Overview", icon: LayoutDashboard },
              { name: "Products", icon: Package },
              { name: "Analytics", icon: BarChart3 },
              { name: "Settings", icon: Settings },
            ].map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => setActiveTab(name)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  activeTab === name
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {name}
                {name === "Products" && (
                  <span className="ml-auto rounded-md bg-white/15 px-2 py-0.5 text-xs">
                    {products.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
              <Sparkles size={19} />
            </div>
            <p className="text-sm font-bold">Productivity boost</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Keep product details accurate and your inventory organized.
            </p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400" />
            </div>
            <p className="mt-2 text-[10px] text-slate-500">
              YOUR INVENTORY WORKSPACE
            </p>
          </div>
        </aside>

        {/* Main dashboard */}
        <main className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 bg-white px-5 py-4 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 lg:hidden">
                <ShoppingBag size={21} />
              </div>
              <div>
                <p className="text-xs text-slate-400">
                  Workspace / {activeTab}
                </p>
                <h2 className="text-lg font-extrabold">{activeTab}</h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-500 sm:block">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                System operational
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white ring-4 ring-violet-50">
                NM
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                  <Sparkles size={13} /> INVENTORY CONTROL CENTER
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  Manage your{" "}
                  <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                    products.
                  </span>
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Select a product, make your changes, and keep your inventory
                  up to date — all in one place.
                </p>
              </div>

              <button
                onClick={() => {
                  if (selectedProduct) selectProduct(selectedProduct);
                }}
                className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm transition hover:border-violet-300 hover:text-violet-700 md:self-auto"
              >
                <RotateCcw size={16} /> Reset form
              </button>
            </div>

            {/* Overview cards */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "Total Products",
                  value: products.length,
                  note: "Products in catalogue",
                  icon: Package,
                  style: "bg-violet-50 text-violet-600",
                  trend: "+ Catalogue",
                },
                {
                  label: "Total Stock",
                  value: totalStock.toLocaleString("en-IN"),
                  note: "Units available",
                  icon: Boxes,
                  style: "bg-blue-50 text-blue-600",
                  trend: "Live count",
                },
                {
                  label: "Inventory Value",
                  value: money(totalValue),
                  note: "Price × stock quantity",
                  icon: IndianRupee,
                  style: "bg-emerald-50 text-emerald-600",
                  trend: "Stock value",
                },
                {
                  label: "Low Stock",
                  value: lowStock,
                  note: "Products under 10 units",
                  icon: TrendingUp,
                  style: "bg-orange-50 text-orange-600",
                  trend: lowStock ? "Needs attention" : "All looking good",
                },
              ].map(({ label, value, note, icon: Icon, style, trend }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50"
                >
                  <div className="flex items-start justify-between">
                    <div className={`rounded-xl p-3 ${style}`}>
                      <Icon size={21} />
                    </div>
                    <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                      {trend}
                    </span>
                  </div>
                  <p className="mt-5 text-sm font-medium text-slate-500">
                    {label}
                  </p>
                  <p className="mt-1 break-words text-2xl font-black tracking-tight text-slate-900">
                    {value}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{note}</p>
                </div>
              ))}
            </div>

            {activeTab !== "Products" ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                  {activeTab === "Overview" ? (
                    <LayoutDashboard />
                  ) : activeTab === "Analytics" ? (
                    <BarChart3 />
                  ) : (
                    <Settings />
                  )}
                </div>
                <h2 className="text-2xl font-black">{activeTab}</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Your product inventory contains {products.length} products
                  with {totalStock} units in stock, worth {money(totalValue)}.
                </p>
                <button
                  onClick={() => setActiveTab("Products")}
                  className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white hover:bg-violet-700"
                >
                  Return to product management
                </button>
              </section>
            ) : (
              <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                {/* Product list */}
                <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                  <div className="border-b border-slate-100 p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-extrabold text-slate-900">
                          Product catalogue
                        </h2>
                        <p className="mt-1 text-xs text-slate-400">
                          Choose an item to edit its information
                        </p>
                      </div>
                      <span className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
                        {filteredProducts.length} ITEMS
                      </span>
                    </div>

                    <div className="relative mt-5">
                      <Search
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search product name or SKU..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-50"
                      />
                    </div>

                    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setCategoryFilter(category)}
                          className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                            categoryFilter === category
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-500 hover:bg-violet-50 hover:text-violet-700"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => selectProduct(product)}
                        className={`flex w-full items-center gap-3 p-4 text-left transition sm:gap-4 sm:px-5 ${
                          selectedId === product.id
                            ? "bg-violet-50/70"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${product.color} text-2xl shadow-sm`}
                        >
                          {product.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-bold text-slate-800">
                              {product.name}
                            </p>
                            {selectedId === product.id && (
                              <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[9px] font-bold text-violet-700">
                                SELECTED
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-slate-400">
                            {product.sku} · {product.category}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                product.stock < 10
                                  ? "bg-orange-500"
                                  : "bg-emerald-500"
                              }`}
                            />
                            <span className="text-[11px] text-slate-500">
                              {product.stock} units in stock
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-extrabold text-slate-900">
                            {money(product.price)}
                          </p>
                          <div
                            className={`mt-2 inline-flex rounded-lg p-2 ${
                              selectedId === product.id
                                ? "bg-violet-600 text-white"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <Pencil size={13} />
                          </div>
                        </div>
                      </button>
                    ))}

                    {filteredProducts.length === 0 && (
                      <div className="p-10 text-center">
                        <Package
                          className="mx-auto mb-3 text-slate-300"
                          size={34}
                        />
                        <p className="font-bold text-slate-700">
                          No products found
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          Try another search or category.
                        </p>
                        <button
                          onClick={() => {
                            setSearch("");
                            setCategoryFilter("All");
                          }}
                          className="mt-4 text-sm font-semibold text-violet-600"
                        >
                          Clear filters
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3">
                    <p className="text-xs text-slate-400">
                      <Layers size={13} className="mr-1 inline" />
                      Demo inventory · Changes update this dashboard instantly
                    </p>
                  </div>
                </section>

                {/* Edit panel */}
                <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                  <div className="relative overflow-hidden bg-gradient-to-br from-[#292044] via-[#4b3284] to-[#7754d8] p-6 text-white sm:p-7">
                    <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border-[30px] border-white/5" />
                    <div className="absolute -bottom-16 right-20 h-32 w-32 rounded-full bg-fuchsia-400/10 blur-2xl" />

                    <div className="relative flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold tracking-wider">
                          <Pencil size={12} /> EDIT MODE
                        </div>
                        <h2 className="text-2xl font-black">
                          Update product
                        </h2>
                        <p className="mt-2 max-w-xs text-xs leading-5 text-violet-100">
                          Modify the fields below and save to update your
                          catalogue.
                        </p>
                      </div>
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                        <Package size={24} />
                      </div>
                    </div>

                    <div className="relative mt-6 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-2xl">
                        {selectedProduct?.icon || "📦"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">
                          {selectedProduct?.name || "No product selected"}
                        </p>
                        <p className="mt-1 text-xs text-violet-100">
                          Product ID: #{selectedId}
                        </p>
                      </div>
                      <ArrowUpRight size={18} className="text-violet-200" />
                    </div>
                  </div>

                  <form onSubmit={handleUpdate} className="p-5 sm:p-7">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h3 className="font-extrabold text-slate-900">
                          Product details
                        </h3>
                        <p className="mt-1 text-xs text-slate-400">
                          Fields marked * are required
                        </p>
                      </div>
                      <span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700">
                        <span className="mr-1">●</span> EDITABLE
                      </span>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="mb-2 block text-xs font-bold text-slate-600">
                          Product name *
                        </label>
                        <input
                          required
                          value={form.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          placeholder="Enter product name"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-xs font-bold text-slate-600">
                            Category *
                          </label>
                          <select
                            value={form.category}
                            onChange={(e) =>
                              updateField("category", e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
                          >
                            {categories
                              .filter((c) => c !== "All")
                              .map((category) => (
                                <option key={category}>{category}</option>
                              ))}
                          </select>
                        </div>
                        <div>
                          <label className="mb-2 block text-xs font-bold text-slate-600">
                            SKU code *
                          </label>
                          <input
                            required
                            value={form.sku}
                            onChange={(e) => updateField("sku", e.target.value)}
                            placeholder="e.g. EL-101"
                            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-xs font-bold text-slate-600">
                            Selling price (₹) *
                          </label>
                          <div className="relative">
                            <IndianRupee
                              size={15}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                              required
                              type="number"
                              min="0"
                              step="0.01"
                              value={form.price}
                              onChange={(e) =>
                                updateField("price", e.target.value)
                              }
                              className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-2 block text-xs font-bold text-slate-600">
                            Stock quantity *
                          </label>
                          <div className="relative">
                            <Boxes
                              size={15}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                              required
                              type="number"
                              min="0"
                              step="1"
                              value={form.stock}
                              onChange={(e) =>
                                updateField("stock", e.target.value)
                              }
                              className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 rounded-xl border border-dashed border-violet-200 bg-violet-50/70 p-4">
                      <p className="text-xs font-bold text-violet-800">
                        <IndianRupee size={14} className="mr-1 inline" />
                        Updated stock value
                      </p>
                      <p className="mt-1 text-2xl font-black text-violet-700">
                        {money(
                          Math.max(0, Number(form.price) || 0) *
                            Math.max(0, Number(form.stock) || 0)
                        )}
                      </p>
                      <p className="mt-1 text-[11px] text-violet-500">
                        Calculated automatically from price × stock
                      </p>
                    </div>

                    {message && (
                      <div
                        role="status"
                        className={`mt-5 flex items-start gap-2 rounded-xl border p-3 text-sm font-medium ${
                          message.startsWith("Successfully") ||
                          message.startsWith("Previous")
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-rose-200 bg-rose-50 text-rose-700"
                        }`}
                      >
                        {message.startsWith("Successfully") ||
                        message.startsWith("Previous") ? (
                          <CircleCheck className="mt-0.5 shrink-0" size={17} />
                        ) : (
                          <X className="mt-0.5 shrink-0" size={17} />
                        )}
                        {message}
                      </div>
                    )}

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="submit"
                        disabled={!selectedProduct}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-200 disabled:opacity-50"
                      >
                        <Check size={17} /> Save changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedProduct) selectProduct(selectedProduct);
                        }}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        <X size={16} /> Cancel
                      </button>
                    </div>

                    {history.length > 0 && (
                      <button
                        type="button"
                        onClick={undoUpdate}
                        className="mt-4 flex w-full items-center justify-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-violet-700"
                      >
                        <RotateCcw size={13} />
                        Undo last saved update
                      </button>
                    )}
                  </form>
                </section>
              </div>
            )}

            <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row">
              <p>© 2026 NEXUS Inventory Studio · React Practical 08</p>
              <p className="flex items-center gap-1">
                Built with <span className="font-semibold text-violet-500">React</span>
                <span>+</span>
                <span className="font-semibold text-cyan-600">Tailwind CSS</span>
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
