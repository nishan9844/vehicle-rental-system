import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Search,
  Trash2,
  X,
  RefreshCw,
} from "lucide-react";
import { deleteBooking, getBookings, updateBookingStatus } from "../services/bookingService";

const fallbackImage =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&h=600&fit=crop";

const statusOptions = ["pending", "confirmed", "active", "completed", "cancelled"];

// ─── helpers ─────────────────────────────────────────────────────────────────

function pickValue(source, keys, fallback = "") {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null && source?.[key] !== "") {
      return source[key];
    }
  }
  return fallback;
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
  return date.toLocaleString("en-NP", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-NP", { month: "short", day: "numeric" });
}

function formatStatus(status) {
  return String(status || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function normalizeBooking(booking) {
  const pickupDate = pickValue(booking, ["pickup_date", "pickupDate"]);
  const returnDate = pickValue(booking, ["return_date", "returnDate"]);
  const amount = pickValue(booking, ["total_price", "amount"], 0);

  // vehicle name: comes from the joined vehicles relation OR from flat field
  const vehicleName = booking.vehicles?.name || pickValue(booking, ["vehicle_name"], "Vehicle");
  const vehicleImage = booking.vehicles?.image_url || pickValue(booking, ["vehicle_image"], fallbackImage);

  return {
    raw: booking,
    id: booking.id,
    displayId: booking.booking_code || `#BK-${String(booking.id).slice(0, 8)}`,
    customer: pickValue(booking, ["full_name", "customer_name"]),
    email: pickValue(booking, ["email", "customer_email"]),
    phone: pickValue(booking, ["phone", "customer_phone"]),
    vehicle: vehicleName,
    vehicleImage,
    pickupDate,
    returnDate,
    duration: `${formatDateShort(pickupDate)} → ${formatDateShort(returnDate)}`,
    amount,
    status: String(booking.status || "pending").toLowerCase(),
    subtotal: pickValue(booking, ["subtotal"], amount),
    taxes: pickValue(booking, ["taxes"], 0),
    securityDeposit: pickValue(booking, ["deposit"], 0),
    paymentStatus: pickValue(booking, ["payment_status"], "unpaid"),
    licenseId: pickValue(booking, ["license_id"], "—"),
    documentation: pickValue(booking, ["documentation"], "—"),
    notes: pickValue(booking, ["notes"], ""),
    createdAt: pickValue(booking, ["created_at"], ""),
  };
}

function getStatusColor(status) {
  switch (status) {
    case "active":
    case "confirmed":
      return "bg-green-50 text-green-700 border-green-200";
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "completed":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function getPaymentStatusColor(status) {
  const s = String(status || "").toLowerCase();
  if (s === "paid") return "text-green-600 font-semibold";
  if (s === "unpaid" || s === "pending") return "text-yellow-600 font-semibold";
  return "text-gray-600";
}

// ─── component ────────────────────────────────────────────────────────────────

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    setError("");
    try {
      const data = await getBookings();
      setBookings(data || []);
    } catch (err) {
      setError(err.message || "Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(booking, status) {
    setSavingId(booking.id);
    setError("");
    setNotice("");
    try {
      const updated = await updateBookingStatus(booking.id, status);
      setBookings((cur) => cur.map((item) => (item.id === booking.id ? updated : item)));
      const normalized = normalizeBooking(updated);
      setSelectedBooking(normalized);
      setNotice(`Booking ${normalized.displayId} updated to ${formatStatus(status)}.`);
    } catch (err) {
      setError(err.message || "Unable to update booking.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(booking) {
    if (!window.confirm(`Delete booking ${booking.displayId}? This cannot be undone.`)) return;
    setSavingId(booking.id);
    setError("");
    setNotice("");
    try {
      await deleteBooking(booking.id);
      setBookings((cur) => cur.filter((item) => item.id !== booking.id));
      setSelectedBooking(null);
      setNotice("Booking deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete booking.");
    } finally {
      setSavingId(null);
    }
  }

  const normalizedBookings = useMemo(() => bookings.map(normalizeBooking), [bookings]);

  const filteredBookings = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return normalizedBookings.filter((b) => {
      const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
      const matchesSearch =
        !term ||
        [b.customer, b.email, b.phone, b.vehicle, b.displayId].some((v) =>
          String(v || "").toLowerCase().includes(term)
        );
      return matchesStatus && matchesSearch;
    });
  }, [normalizedBookings, searchTerm, statusFilter]);

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className={`flex-1 ${selectedBooking ? "mr-96" : ""} transition-all duration-300`}>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
            <p className="text-gray-600">All customer reservations from Supabase, live.</p>
          </div>
          <button
            onClick={fetchBookings}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {(notice || error) && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
          >
            {error || notice}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, email, vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-3 rounded-lg text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900"
            >
              <option value="ALL">All statuses</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>{formatStatus(s)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-8 text-gray-600">Loading bookings from Supabase...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-10 text-center">
              <Calendar size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "ALL"
                  ? "No bookings match your filters."
                  : "No bookings yet. They will appear here after customers book on the user site."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-sm font-medium text-gray-600">
                    <th className="p-4">Customer</th>
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <td className="p-4">
                        <p className="font-medium text-gray-900">{booking.customer}</p>
                        <p className="text-xs text-gray-500">{booking.displayId}</p>
                        <p className="text-xs text-gray-400">{booking.email}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={booking.vehicleImage}
                            alt={booking.vehicle}
                            className="w-10 h-8 object-cover rounded"
                            onError={(e) => { e.currentTarget.src = fallbackImage; }}
                          />
                          <span className="text-sm">{booking.vehicle}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{booking.duration}</td>
                      <td className="p-4 font-medium">{formatMoney(booking.amount)}</td>
                      <td className="p-4">
                        <span className={`text-sm ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          {formatStatus(booking.paymentStatus)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}
                        >
                          {formatStatus(booking.status)}
                        </span>
                      </td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2">
                          {booking.status === "pending" && (
                            <button
                              onClick={() => handleStatusChange(booking, "confirmed")}
                              disabled={savingId === booking.id}
                              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                              Confirm
                            </button>
                          )}
                          {booking.status === "confirmed" && (
                            <button
                              onClick={() => handleStatusChange(booking, "active")}
                              disabled={savingId === booking.id}
                              className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-60"
                            >
                              Activate
                            </button>
                          )}
                          {["active", "confirmed"].includes(booking.status) && (
                            <button
                              onClick={() => handleStatusChange(booking, "completed")}
                              disabled={savingId === booking.id}
                              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-60"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedBooking && (
        <aside className="fixed right-0 top-20 z-20 h-[calc(100vh-5rem)] w-96 overflow-y-auto border-l border-gray-200 bg-white shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)}>
                <X size={20} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <img
              src={selectedBooking.vehicleImage || fallbackImage}
              alt={selectedBooking.vehicle}
              className="w-full h-48 object-cover rounded-lg mb-4"
              onError={(e) => { e.currentTarget.src = fallbackImage; }}
            />
            <h3 className="text-xl font-bold text-gray-900">{selectedBooking.vehicle}</h3>
            <p className="text-gray-500 text-sm mb-6">{selectedBooking.displayId}</p>

            <div className="space-y-4 text-sm">
              <div><p className="text-gray-500">Customer</p><p className="font-medium">{selectedBooking.customer}</p></div>
              <div><p className="text-gray-500">Email</p><p>{selectedBooking.email}</p></div>
              <div><p className="text-gray-500">Phone</p><p>{selectedBooking.phone}</p></div>
              <div><p className="text-gray-500">License ID</p><p>{selectedBooking.licenseId}</p></div>
              <div><p className="text-gray-500">Citizenship</p><p>{selectedBooking.documentation}</p></div>
              <div><p className="text-gray-500">Pickup Date</p><p>{formatDate(selectedBooking.pickupDate)}</p></div>
              <div><p className="text-gray-500">Return Date</p><p>{formatDate(selectedBooking.returnDate)}</p></div>
              <div><p className="text-gray-500">Subtotal</p><p>{formatMoney(selectedBooking.subtotal)}</p></div>
              <div><p className="text-gray-500">Taxes (15%)</p><p>{formatMoney(selectedBooking.taxes)}</p></div>
              <div><p className="text-gray-500">Security Deposit</p><p>{formatMoney(selectedBooking.securityDeposit)}</p></div>
              <div><p className="text-gray-500">Total Amount</p><p className="font-bold text-gray-900 text-base">{formatMoney(selectedBooking.amount)}</p></div>
              <div>
                <p className="text-gray-500">Payment Status</p>
                <p className={getPaymentStatusColor(selectedBooking.paymentStatus)}>{formatStatus(selectedBooking.paymentStatus)}</p>
              </div>

              {/* Status change */}
              <div>
                <p className="text-gray-500 mb-2">Update Booking Status</p>
                <select
                  value={selectedBooking.status}
                  disabled={savingId === selectedBooking.id}
                  onChange={(e) => handleStatusChange(selectedBooking, e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{formatStatus(s)}</option>
                  ))}
                </select>
              </div>

              {selectedBooking.notes && (
                <div><p className="text-gray-500">Notes</p><p>{selectedBooking.notes}</p></div>
              )}

              <button
                onClick={() => handleDelete(selectedBooking)}
                disabled={savingId === selectedBooking.id}
                className="w-full mt-4 rounded-lg border border-red-200 px-4 py-2 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Trash2 size={16} />
                Delete Booking
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default Bookings;
