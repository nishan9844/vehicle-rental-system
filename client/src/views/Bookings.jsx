import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  CreditCard,
  Search,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import {
  deleteBooking,
  getBookings,
  updateBookingStatus,
} from "../services/bookingService";

const fallbackImage = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&h=600&fit=crop";

const statusOptions = [
  "pending",
  "confirmed",
  "active",
  "completed",
  "cancelled",
];

function pickValue(source, keys, fallback = "") {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null && source?.[key] !== "") {
      return source[key];
    }
  }

  return fallback;
}

function formatMoney(amount) {
  const value = Number(amount || 0);

  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value) {
  if (!value) return "Not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("en-NP", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(value) {
  if (!value) return "Not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-NP", {
    month: "short",
    day: "numeric",
  });
}

function formatStatus(status) {
  return String(status || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeBooking(booking) {
  const pickupDate = pickValue(booking, [
    "pickup_date",
    "pickupDate",
    "start_date",
    "startDate",
    "from_date",
  ]);

  const returnDate = pickValue(booking, [
    "return_date",
    "returnDate",
    "end_date",
    "endDate",
    "to_date",
  ]);

  const amount = pickValue(booking, [
    "total_price",
    "amount",
    "total_amount",
    "totalAmount",
    "price",
    "total",
  ], 0);

  const vehicle = booking.vehicle || booking.vehicles || {};
  const customer = booking.customer || booking.customers || booking.user || {};

  return {
    raw: booking,
    id: booking.id,
    displayId: booking.booking_code || booking.bookingCode || booking.reference || `#BK-${booking.id}`,
    customer: pickValue(
      booking,
      ["customer_name", "customerName", "name", "full_name"],
      pickValue(customer, ["name", "full_name"], "Unknown customer")
    ),
    email: pickValue(
      booking,
      ["customer_email", "customerEmail", "email"],
      pickValue(customer, ["email"], "No email")
    ),
    phone: pickValue(
      booking,
      ["customer_phone", "customerPhone", "phone"],
      pickValue(customer, ["phone"], "No phone")
    ),
    vehicle: pickValue(
      booking,
      ["vehicle_name", "vehicleName"],
      pickValue(vehicle, ["name"], "Unknown vehicle")
    ),
    vehicleImage: pickValue(
      booking,
      ["vehicle_image", "vehicleImage", "image_url", "image"],
      pickValue(vehicle, ["image_url", "image"], fallbackImage)
    ),
    pickupDate,
    returnDate,
    duration: `${formatDateShort(pickupDate)} - ${formatDateShort(returnDate)}`,
    amount,
    status: String(booking.status || "pending").toLowerCase(),
    subtotal: pickValue(booking, ["subtotal", "sub_total"], amount),
    taxes: pickValue(booking, ["taxes", "tax_amount", "taxAmount"], 0),
    insurance: pickValue(booking, ["insurance", "insurance_amount", "insuranceAmount"], 0),
    securityDeposit: pickValue(booking, ["security_deposit", "securityDeposit", "deposit"], 0),
    paymentStatus: pickValue(booking, ["payment_status", "paymentStatus"], "Not set"),
    notes: pickValue(booking, ["notes", "message", "remarks"], ""),
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
    case "refunded":
      return "bg-purple-50 text-purple-700 border-purple-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

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
      setBookings(data);
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

      setBookings((current) =>
        current.map((item) => (item.id === booking.id ? updated : item))
      );

      setSelectedBooking(normalizeBooking(updated));
      setNotice(`Booking ${normalizeBooking(updated).displayId} changed to ${formatStatus(status)}.`);
    } catch (err) {
      setError(err.message || "Unable to update booking status.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(booking) {
    const confirmDelete = window.confirm(
      `Delete booking ${booking.displayId}? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    setSavingId(booking.id);
    setError("");
    setNotice("");

    try {
      await deleteBooking(booking.id);
      setBookings((current) => current.filter((item) => item.id !== booking.id));
      setSelectedBooking(null);
      setNotice("Booking deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete booking.");
    } finally {
      setSavingId(null);
    }
  }

  const normalizedBookings = useMemo(() => {
    return bookings.map(normalizeBooking);
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return normalizedBookings.filter((booking) => {
      const matchesStatus = statusFilter === "ALL" || booking.status === statusFilter;

      const matchesSearch = !term || [
        booking.displayId,
        booking.customer,
        booking.email,
        booking.phone,
        booking.vehicle,
        booking.status,
      ].some((value) => String(value || "").toLowerCase().includes(term));

      return matchesStatus && matchesSearch;
    });
  }, [normalizedBookings, searchTerm, statusFilter]);

  const summaryCards = useMemo(() => {
    const active = normalizedBookings.filter((booking) =>
      ["active", "confirmed"].includes(booking.status)
    ).length;

    const pending = normalizedBookings.filter((booking) => booking.status === "pending").length;
    const today = new Date().toDateString();

    const checkInsToday = normalizedBookings.filter((booking) => {
      const date = new Date(booking.pickupDate);
      return !Number.isNaN(date.getTime()) && date.toDateString() === today;
    }).length;

    return [
      { title: "Total Active", value: active, icon: Users, color: "bg-blue-500" },
      { title: "Pending Approval", value: pending, icon: Clock, color: "bg-yellow-500" },
      { title: "Check-ins Today", value: checkInsToday, icon: Calendar, color: "bg-green-500" },
    ];
  }, [normalizedBookings]);

  return (
    <div className="flex h-full">
      <div className={`flex-1 ${selectedBooking ? "mr-96" : ""} transition-all duration-300`}>
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings Management</h1>
            <p className="text-gray-600">
              Manage customer reservations, approvals, cancellations, and returns.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchBookings}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
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

        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {summaryCards.map((card) => (
            <div key={card.title} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                  <card.icon size={24} className="text-white" />
                </div>
                <span className="text-sm text-gray-500">Live data</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
              <p className="text-sm text-gray-600">{card.title}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search bookings, customers, vehicles..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="ALL">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{formatStatus(status)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-8 text-gray-600">Loading bookings...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Calendar size={24} />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-gray-900">No bookings found</h2>
              <p className="mt-1 text-sm text-gray-600">
                {searchTerm || statusFilter !== "ALL"
                  ? "Try changing your search or filter."
                  : "Bookings will appear here after customers reserve vehicles."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Customer</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Vehicle</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Duration</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Amount</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <td className="p-4">
                        <div>
                          <p className="text-gray-900 font-medium">{booking.customer}</p>
                          <p className="text-xs text-gray-500">{booking.displayId}</p>
                        </div>
                      </td>

                      <td className="p-4">
                        <p className="text-gray-900">{booking.vehicle}</p>
                      </td>

                      <td className="p-4">
                        <p className="text-sm text-gray-600">{booking.duration}</p>
                      </td>

                      <td className="p-4">
                        <p className="text-gray-900 font-medium">{formatMoney(booking.amount)}</p>
                      </td>

                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {formatStatus(booking.status)}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2">
                          {booking.status === "pending" && (
                            <button
                              type="button"
                              disabled={savingId === booking.id}
                              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleStatusChange(booking, "confirmed");
                              }}
                            >
                              <Check size={14} />
                              Confirm
                            </button>
                          )}

                          {["active", "confirmed"].includes(booking.status) && (
                            <button
                              type="button"
                              disabled={savingId === booking.id}
                              className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleStatusChange(booking, "completed");
                              }}
                            >
                              <Check size={14} />
                              Complete
                            </button>
                          )}

                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Details
                            <ChevronRight size={14} />
                          </button>
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

      {selectedBooking && (
        <aside className="fixed right-0 top-20 z-20 h-[calc(100vh-5rem)] w-96 overflow-y-auto border-l border-gray-200 bg-white shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Selected Booking</h2>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <div className="relative h-48 rounded-lg overflow-hidden mb-4 bg-gray-100">
                <img
                  src={selectedBooking.vehicleImage || fallbackImage}
                  alt={selectedBooking.vehicle}
                  className="w-full h-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = fallbackImage;
                  }}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {selectedBooking.vehicle}
              </h3>
              <p className="text-sm text-gray-500">{selectedBooking.displayId}</p>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
                Customer Details
              </h4>
              <div className="space-y-2">
                <p className="text-gray-900 font-medium">{selectedBooking.customer}</p>
                <p className="text-sm text-gray-600">{selectedBooking.email}</p>
                <p className="text-sm text-gray-600">{selectedBooking.phone}</p>
                <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                  <User size={14} />
                  Customer profile
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
                Booking Timeline
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Pickup</p>
                    <p className="text-xs text-gray-500">{formatDate(selectedBooking.pickupDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Return</p>
                    <p className="text-xs text-gray-500">{formatDate(selectedBooking.returnDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
                Financial Breakdown
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatMoney(selectedBooking.subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="text-gray-900">{formatMoney(selectedBooking.taxes)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Insurance Premium</span>
                  <span className="text-gray-900">{formatMoney(selectedBooking.insurance)}</span>
                </div>

                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-base font-medium">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{formatMoney(selectedBooking.amount)}</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-600">Security Deposit</span>
                    <span className="text-blue-600">{formatMoney(selectedBooking.securityDeposit)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 rounded-lg border border-gray-200 p-4">
              <label className="text-sm font-medium text-gray-700">Booking Status</label>
              <select
                value={selectedBooking.status}
                disabled={savingId === selectedBooking.id}
                onChange={(event) => handleStatusChange(selectedBooking, event.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{formatStatus(status)}</option>
                ))}
              </select>
            </div>

            {selectedBooking.notes && (
              <div className="mb-6 rounded-lg bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <AlertCircle size={16} />
                  Notes
                </div>
                <p className="text-sm text-gray-600">{selectedBooking.notes}</p>
              </div>
            )}

            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <CreditCard size={16} />
                Payment
              </div>
              <p className="text-sm text-gray-600">{selectedBooking.paymentStatus}</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={savingId === selectedBooking.id || selectedBooking.status === "cancelled"}
                onClick={() => handleStatusChange(selectedBooking, "cancelled")}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={savingId === selectedBooking.id}
                onClick={() => handleDelete(selectedBooking)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-60"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default Bookings;
