import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  Star,
  Trash2,
  TrendingUp,
  User,
  Users,
  X,
  XCircle,
} from "lucide-react";
import {
  deleteCustomer,
  getCustomers,
  updateCustomerStatus,
  updateCustomerVerification,
} from "../services/customerService";

const fallbackAvatar =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face";

const statusOptions = ["active", "pending", "blocked"];
const verificationOptions = ["verified", "pending_doc", "rejected", "unverified"];

// ─── helpers ─────────────────────────────────────────────────────────────────

function pickValue(source, keys, fallback = "") {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null && source?.[key] !== "") {
      return source[key];
    }
  }
  return fallback;
}

function formatLabel(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function formatMoney(amount) {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}

function formatDate(value) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-NP", { month: "long", year: "numeric" });
}

function normalizeCustomer(customer) {
  return {
    raw: customer,
    id: customer.id,
    displayId:
      customer.customer_code ||
      customer.customerCode ||
      customer.reference ||
      `CUST-${String(customer.id).slice(0, 8)}`,
    name: pickValue(customer, ["name", "full_name", "fullName", "customer_name"], "Unknown customer"),
    email: pickValue(customer, ["email", "customer_email"], "No email"),
    phone: pickValue(customer, ["phone", "mobile", "contact", "customer_phone"], "No phone"),
    verification: String(
      pickValue(customer, ["verification", "verification_status"], "UNVERIFIED")
    )
      .toLowerCase()
      .replace(/\s+/g, "_"),
    licenseNumber: pickValue(
      customer,
      ["license_number", "licenseNumber", "driving_license", "license"],
      "Not provided"
    ),
    // These are now enriched by customerService.getCustomers()
    bookings: Number(customer.bookings ?? 0),
    revenue: Number(customer.revenue ?? 0),
    status: String(pickValue(customer, ["status"], "PENDING")).toLowerCase(),
    joinDate: pickValue(customer, ["join_date", "joinDate", "created_at", "createdAt"], ""),
    avatar: pickValue(
      customer,
      ["avatar", "avatar_url", "avatarUrl", "image", "photo"],
      fallbackAvatar
    ),
    address: pickValue(customer, ["address", "location"], "No address"),
    notes: pickValue(customer, ["notes", "remarks"], ""),
  };
}

function getVerificationBadge(verification) {
  switch (verification) {
    case "licensed":
    case "verified":
      return { color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle };
    case "pending_doc":
    case "pending":
      return { color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock };
    case "suspicious":
    case "rejected":
      return { color: "bg-red-50 text-red-700 border-red-200", icon: AlertTriangle };
    default:
      return { color: "bg-gray-50 text-gray-700 border-gray-200", icon: XCircle };
  }
}

function getStatusBadge(status) {
  switch (status) {
    case "active":
      return "bg-green-50 text-green-700 border-green-200";
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "blocked":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

// ─── component ────────────────────────────────────────────────────────────────

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    setError("");
    try {
      const data = await getCustomers();
      setCustomers(data || []);
    } catch (err) {
      setError(err.message || "Unable to load customers.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(customer, status) {
    setSavingId(customer.id);
    setError("");
    setNotice("");
    try {
      const updated = await updateCustomerStatus(customer.id, status);
      const normalized = normalizeCustomer(updated);
      setCustomers((cur) => cur.map((item) => (item.id === customer.id ? { ...updated, bookings: customer.bookings, revenue: customer.revenue } : item)));
      setSelectedCustomer(normalized);
      setNotice(`${normalized.name} status changed to ${formatLabel(status)}.`);
    } catch (err) {
      setError(err.message || "Unable to update customer status.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleVerificationChange(customer, verification) {
    setSavingId(customer.id);
    setError("");
    setNotice("");
    try {
      const updated = await updateCustomerVerification(customer.id, verification);
      const normalized = normalizeCustomer({ ...updated, bookings: customer.bookings, revenue: customer.revenue });
      setCustomers((cur) => cur.map((item) => (item.id === customer.id ? { ...updated, bookings: customer.bookings, revenue: customer.revenue } : item)));
      setSelectedCustomer(normalized);
      setNotice(`${normalized.name} verification changed to ${formatLabel(verification)}.`);
    } catch (err) {
      setError(err.message || "Unable to update verification.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(customer) {
    if (!window.confirm(`Delete ${customer.name}? This action cannot be undone.`)) return;
    setSavingId(customer.id);
    setError("");
    setNotice("");
    try {
      await deleteCustomer(customer.id);
      setCustomers((cur) => cur.filter((item) => item.id !== customer.id));
      setSelectedCustomer(null);
      setNotice("Customer deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete customer.");
    } finally {
      setSavingId(null);
    }
  }

  function handleExportCsv() {
    if (filteredCustomers.length === 0) return;
    const headers = ["ID", "Name", "Email", "Phone", "Verification", "Status", "Bookings", "Revenue (NPR)", "Joined"];
    const rows = filteredCustomers.map((c) => [
      c.displayId, c.name, c.email, c.phone, c.verification, c.status, c.bookings, c.revenue, c.joinDate,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `customers-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const normalizedCustomers = useMemo(() => customers.map(normalizeCustomer), [customers]);

  const filteredCustomers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = normalizedCustomers.filter((c) => {
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesSearch =
        !term ||
        [c.displayId, c.name, c.email, c.phone, c.licenseNumber, c.status, c.verification].some((v) =>
          String(v || "").toLowerCase().includes(term)
        );
      return matchesStatus && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "newest") return new Date(b.joinDate || 0) - new Date(a.joinDate || 0);
      if (sortBy === "revenue") return b.revenue - a.revenue;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return b.bookings - a.bookings; // default: most bookings
    });
  }, [normalizedCustomers, searchTerm, statusFilter, sortBy]);

  const summaryCards = useMemo(() => {
    const total = normalizedCustomers.length;
    const active = normalizedCustomers.filter((c) => c.status === "active").length;
    const pending = normalizedCustomers.filter((c) =>
      ["pending_doc", "pending", "unverified"].includes(c.verification)
    ).length;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeek = normalizedCustomers.filter((c) => {
      const d = new Date(c.joinDate);
      return !Number.isNaN(d.getTime()) && d >= weekAgo;
    }).length;

    return [
      { title: "Total Customers", value: total, change: "Live", icon: Users, color: "bg-blue-500", trend: "up" },
      { title: "Active Drivers", value: active, change: "Active", icon: CheckCircle, color: "bg-green-500", trend: "up" },
      { title: "Pending Verification", value: pending, change: "Review", icon: Clock, color: "bg-yellow-500", trend: "priority" },
      { title: "New This Week", value: thisWeek, change: "New", icon: Star, color: "bg-purple-500", trend: "new" },
    ];
  }, [normalizedCustomers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers Management</h1>
          <p className="text-gray-600">Customer profiles, verification, booking history and revenue from Supabase.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filteredCustomers.length === 0}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button
            type="button"
            onClick={fetchCustomers}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Notice / Error banner */}
      {(notice || error) && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
        >
          {error || notice}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card) => (
          <div key={card.title} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon size={24} className="text-white" />
              </div>
              {card.trend === "up" && (
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp size={16} />
                  <span className="text-sm font-medium">{card.change}</span>
                </div>
              )}
              {card.trend === "priority" && (
                <span className="px-2 py-1 bg-yellow-50 text-yellow-600 text-xs rounded-full border border-yellow-200">
                  {card.change}
                </span>
              )}
              {card.trend === "new" && (
                <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full border border-purple-200">
                  {card.change}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
            <p className="text-sm text-gray-600">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, email, phone, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 px-4 py-3 pr-10 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                >
                  <option value="all">Status: All</option>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{formatLabel(s)}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 px-4 py-3 pr-10 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                >
                  <option value="newest">Newest First</option>
                  <option value="bookings">Most Bookings</option>
                  <option value="revenue">Highest Revenue</option>
                  <option value="name">Name A–Z</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-gray-600">Loading customers from Supabase...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users size={24} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">No customers found</h2>
            <p className="mt-1 text-sm text-gray-600">
              {searchTerm || statusFilter !== "all"
                ? "Try changing your search or filter."
                : "Customers will appear here once users sign up on the user site."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Full Name</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Email / Phone</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Verification</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Bookings</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Revenue</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => {
                  const vBadge = getVerificationBadge(customer.verification);
                  const VIcon = vBadge.icon;
                  return (
                    <tr
                      key={customer.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={customer.avatar || fallbackAvatar}
                              alt={customer.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.src = fallbackAvatar; }}
                            />
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium">{customer.name}</p>
                            <p className="text-xs text-gray-500">Joined {formatDate(customer.joinDate)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-gray-400" />
                            <p className="text-sm text-gray-600 truncate max-w-[180px]">{customer.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400" />
                            <p className="text-sm text-gray-600">{customer.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${vBadge.color}`}>
                          <VIcon size={10} />
                          {formatLabel(customer.verification)}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-gray-900">{customer.bookings}</td>
                      <td className="p-4 text-sm text-gray-700">{formatMoney(customer.revenue)}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(customer.status)}`}>
                          {formatLabel(customer.status)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          {customer.status !== "active" && (
                            <button
                              type="button"
                              disabled={savingId === customer.id}
                              onClick={() => handleStatusChange(customer, "active")}
                              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                              Activate
                            </button>
                          )}
                          {customer.status !== "blocked" && (
                            <button
                              type="button"
                              disabled={savingId === customer.id}
                              onClick={() => handleStatusChange(customer, "blocked")}
                              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                            >
                              Block
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing {filteredCustomers.length} of {normalizedCustomers.length} customers
          </p>
        </div>
      </div>

      {/* Detail Side Panel */}
      {selectedCustomer && (
        <aside className="fixed right-0 top-20 z-20 h-[calc(100vh-5rem)] w-96 overflow-y-auto border-l border-gray-200 bg-white shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Customer Profile</h2>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center border-b border-gray-200 pb-6">
              <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-100">
                <img
                  src={selectedCustomer.avatar || fallbackAvatar}
                  alt={selectedCustomer.name}
                  className="h-full w-full object-cover"
                  onError={(e) => { e.currentTarget.src = fallbackAvatar; }}
                />
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">{selectedCustomer.name}</h3>
              <p className="text-sm text-gray-500">{selectedCustomer.displayId}</p>
              <span className={`mt-3 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(selectedCustomer.status)}`}>
                {formatLabel(selectedCustomer.status)}
              </span>
            </div>

            <div className="mt-6 space-y-5">
              {/* Contact */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Contact</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="flex items-center gap-2"><Mail size={14} className="text-gray-400" /> {selectedCustomer.email}</p>
                  <p className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /> {selectedCustomer.phone}</p>
                  <p className="flex items-center gap-2"><User size={14} className="text-gray-400" /> {selectedCustomer.address}</p>
                </div>
              </div>

              {/* License */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">License & Verification</h4>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-sm font-medium text-gray-900">{selectedCustomer.licenseNumber}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-gray-500 flex-shrink-0" />
                    <select
                      value={selectedCustomer.verification}
                      disabled={savingId === selectedCustomer.id}
                      onChange={(e) => handleVerificationChange(selectedCustomer, e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      {verificationOptions.map((v) => (
                        <option key={v} value={v}>{formatLabel(v)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Activity */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Activity</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-gray-50 p-4 text-center">
                    <p className="text-xs font-semibold uppercase text-gray-500">Bookings</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{selectedCustomer.bookings}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 text-center">
                    <p className="text-xs font-semibold uppercase text-gray-500">Revenue</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{formatMoney(selectedCustomer.revenue)}</p>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Account Status</h4>
                <select
                  value={selectedCustomer.status}
                  disabled={savingId === selectedCustomer.id}
                  onChange={(e) => handleStatusChange(selectedCustomer, e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{formatLabel(s)}</option>
                  ))}
                </select>
              </div>

              {selectedCustomer.notes && (
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="text-sm font-medium text-gray-700">Notes</h4>
                  <p className="mt-2 text-sm text-gray-600">{selectedCustomer.notes}</p>
                </div>
              )}

              <button
                type="button"
                disabled={savingId === selectedCustomer.id}
                onClick={() => handleDelete(selectedCustomer)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                <Trash2 size={16} />
                Delete Customer
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default Customers;
