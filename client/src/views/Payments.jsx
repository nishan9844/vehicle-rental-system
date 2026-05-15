import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  Filter,
  RefreshCw,
  Search,
  Trash2,
  TrendingUp,
  Wallet,
  X,
  XCircle,
} from "lucide-react";
import {
  deletePayment,
  getPayments,
  updatePaymentStatus,
} from "../services/paymentService";

const statusOptions = [
  "paid",
  "pending",
  "failed",
  "refunded",
];

const methodTabs = [
  "all",
  "card",
  "esewa",
  "khalti",
  "cash",
];

const dateFilters = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 3 Months", value: "90" },
  { label: "Last Year", value: "365" },
  { label: "All Time", value: "all" },
];

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
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatAmount(amount) {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
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

function getPaymentDate(payment) {
  return pickValue(payment, [
    "date",
    "paid_at",
    "paidAt",
    "payment_date",
    "paymentDate",
    "created_at",
    "createdAt",
  ]);
}

function normalizeMethod(method) {
  const value = String(method || "card").toLowerCase();

  if (["visa", "mastercard", "credit_card", "debit_card"].includes(value)) {
    return "card";
  }

  return value;
}

function normalizePayment(payment) {
  const customer = payment.customer || payment.customers || payment.user || {};
  const booking = payment.booking || payment.bookings || {};
  const method = normalizeMethod(pickValue(payment, ["method", "payment_method", "paymentMethod"], "card"));
  const amount = pickValue(payment, ["amount", "total", "paid_amount", "paidAmount"], 0);
  const date = getPaymentDate(payment);

  return {
    raw: payment,
    id: payment.id,
    displayId: payment.payment_code || payment.paymentCode || payment.reference || payment.transaction_id || `PAY-${payment.id}`,
    bookingId: pickValue(payment, ["booking_id", "bookingId"], pickValue(booking, ["id"], "")),
    customer: pickValue(payment, ["customer_name", "customerName", "name"], pickValue(customer, ["name", "full_name"], "Unknown customer")),
    email: pickValue(payment, ["customer_email", "customerEmail", "email"], pickValue(customer, ["email"], "")),
    method,
    methodLabel: pickValue(payment, ["method_label", "methodLabel"], formatLabel(method)),
    amount: Number(amount || 0),
    status: String(pickValue(payment, ["status"], "pending")).toLowerCase(),
    date,
    transactionId: pickValue(payment, ["transaction_id", "transactionId", "gateway_reference", "gatewayReference"], ""),
    cardLast4: pickValue(payment, ["card_last4", "cardLast4", "last4"], ""),
    notes: pickValue(payment, ["notes", "remarks"], ""),
  };
}

function getStatusBadge(status) {
  switch (status) {
    case "paid":
      return { color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle };
    case "pending":
      return { color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock };
    case "failed":
      return { color: "bg-red-50 text-red-700 border-red-200", icon: XCircle };
    case "refunded":
      return { color: "bg-purple-50 text-purple-700 border-purple-200", icon: RefreshCw };
    default:
      return { color: "bg-gray-50 text-gray-700 border-gray-200", icon: AlertCircle };
  }
}

function getMethodIcon(method) {
  switch (method) {
    case "esewa":
    case "khalti":
    case "cash":
      return Wallet;
    default:
      return CreditCard;
  }
}

function isWithinDateFilter(payment, dateFilter) {
  if (dateFilter === "all") return true;

  const date = new Date(payment.date);

  if (Number.isNaN(date.getTime())) return false;

  const start = new Date();
  start.setDate(start.getDate() - Number(dateFilter));

  return date >= start;
}

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [dateFilter, setDateFilter] = useState("30");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    setLoading(true);
    setError("");

    try {
      const data = await getPayments();
      setPayments(data);
    } catch (err) {
      setError(err.message || "Unable to load payments.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(payment, status) {
    setSavingId(payment.id);
    setError("");
    setNotice("");

    try {
      const updated = await updatePaymentStatus(payment.id, status);
      setPayments((current) =>
        current.map((item) => (item.id === payment.id ? updated : item))
      );
      setSelectedPayment(normalizePayment(updated));
      setNotice(`${normalizePayment(updated).displayId} changed to ${formatLabel(status)}.`);
    } catch (err) {
      setError(err.message || "Unable to update payment status.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(payment) {
    const confirmDelete = window.confirm(
      `Delete payment ${payment.displayId}? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    setSavingId(payment.id);
    setError("");
    setNotice("");

    try {
      await deletePayment(payment.id);
      setPayments((current) => current.filter((item) => item.id !== payment.id));
      setSelectedPayment(null);
      setNotice("Payment deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete payment.");
    } finally {
      setSavingId(null);
    }
  }

  const normalizedPayments = useMemo(() => {
    return payments.map(normalizePayment);
  }, [payments]);

  const filteredPayments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return normalizedPayments.filter((payment) => {
      const matchesMethod = activeTab === "all" || payment.method === activeTab;
      const matchesDate = isWithinDateFilter(payment, dateFilter);
      const matchesSearch = !term || [
        payment.displayId,
        payment.transactionId,
        payment.customer,
        payment.email,
        payment.method,
        payment.status,
        payment.bookingId,
      ].some((value) => String(value || "").toLowerCase().includes(term));

      return matchesMethod && matchesDate && matchesSearch;
    });
  }, [normalizedPayments, searchTerm, activeTab, dateFilter]);

  const summaryCards = useMemo(() => {
    const totalRevenue = normalizedPayments
      .filter((payment) => payment.status === "paid")
      .reduce((sum, payment) => sum + payment.amount, 0);

    const pendingDeposits = normalizedPayments
      .filter((payment) => payment.status === "pending")
      .reduce((sum, payment) => sum + payment.amount, 0);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyRefunds = normalizedPayments
      .filter((payment) => {
        const date = new Date(payment.date);
        return payment.status === "refunded" && !Number.isNaN(date.getTime()) && date >= weekAgo;
      })
      .reduce((sum, payment) => sum + payment.amount, 0);

    return [
      {
        title: "Total Revenue",
        value: formatAmount(totalRevenue),
        change: "Paid",
        icon: TrendingUp,
        color: "bg-green-500",
      },
      {
        title: "Pending Deposits",
        value: formatAmount(pendingDeposits),
        action: "Review pending",
        icon: Clock,
        color: "bg-yellow-500",
      },
      {
        title: "Weekly Refunds",
        value: formatAmount(weeklyRefunds),
        subtitle: "This Week",
        icon: RefreshCw,
        color: "bg-red-500",
      },
    ];
  }, [normalizedPayments]);

  function handleExportCsv() {
    const headers = ["id", "customer", "method", "amount", "status", "date", "transaction_id"];
    const rows = filteredPayments.map((payment) => [
      payment.displayId,
      payment.customer,
      payment.method,
      payment.amount,
      payment.status,
      payment.date,
      payment.transactionId,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((value) => `"${String(value || "").replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "payments.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments Management</h1>
          <p className="text-gray-600">Monitor and manage all payment transactions.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button
            type="button"
            onClick={fetchPayments}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {(notice || error) && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${error
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}>
          {error || notice}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card) => (
          <div key={card.title} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon size={24} className="text-white" />
              </div>
              {card.change && (
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp size={16} />
                  <span className="text-sm font-medium">{card.change}</span>
                </div>
              )}
              {card.subtitle && (
                <span className="text-xs text-gray-500">{card.subtitle}</span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
            <p className="text-sm text-gray-600">{card.title}</p>
            {card.action && (
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {card.action}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-lg">
              {methodTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  {tab === "all" ? "All Methods" : formatLabel(tab)}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search transactions, customers, IDs..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full sm:w-72 bg-white border border-gray-200 pl-12 pr-4 py-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={(event) => setDateFilter(event.target.value)}
                  className="appearance-none bg-white border border-gray-200 px-4 py-3 pr-10 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                >
                  {dateFilters.map((filter) => (
                    <option key={filter.value} value={filter.value}>{filter.label}</option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-gray-600">Loading payments...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <CreditCard size={24} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">No payments found</h2>
            <p className="mt-1 text-sm text-gray-600">
              {searchTerm || activeTab !== "all" || dateFilter !== "all"
                ? "Try changing your search or filters."
                : "Payments will appear here after transactions are added to Supabase."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Method</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Date & Time</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => {
                  const statusBadge = getStatusBadge(payment.status);
                  const StatusIcon = statusBadge.icon;
                  const MethodIcon = getMethodIcon(payment.method);

                  return (
                    <tr
                      key={payment.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedPayment(payment)}
                    >
                      <td className="p-4">
                        <div>
                          <p className="text-gray-900 font-medium">{payment.customer}</p>
                          <p className="text-xs text-gray-500">{payment.displayId}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <MethodIcon size={16} className="text-gray-600" />
                          </div>
                          <div>
                            <p className="text-gray-900 text-sm">{payment.methodLabel}</p>
                            <p className="text-xs text-gray-500">
                              {payment.cardLast4 ? `**** ${payment.cardLast4}` : payment.transactionId || "No reference"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-gray-900 font-medium">{formatAmount(payment.amount)}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon size={14} className="text-gray-500" />
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                            {formatLabel(payment.status)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-xs text-gray-500">{formatDate(payment.date)}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {payment.status === "pending" && (
                            <button
                              type="button"
                              disabled={savingId === payment.id}
                              onClick={(event) => {
                                event.stopPropagation();
                                handleStatusChange(payment, "paid");
                              }}
                              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                              Mark Paid
                            </button>
                          )}
                          {payment.status === "paid" && (
                            <button
                              type="button"
                              disabled={savingId === payment.id}
                              onClick={(event) => {
                                event.stopPropagation();
                                handleStatusChange(payment, "refunded");
                              }}
                              className="rounded-lg border border-purple-200 px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 disabled:opacity-60"
                            >
                              Refund
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
            Showing {filteredPayments.length} of {normalizedPayments.length} payments
          </p>
        </div>
      </div>

      {selectedPayment && (
        <aside className="fixed right-0 top-20 z-20 h-[calc(100vh-5rem)] w-96 overflow-y-auto border-l border-gray-200 bg-white shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500">Transaction</p>
              <h3 className="mt-1 text-xl font-bold text-gray-900">{selectedPayment.displayId}</h3>
              <p className="mt-1 text-sm text-gray-600">{formatDate(selectedPayment.date)}</p>
              <div className="mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(selectedPayment.status).color}`}>
                  {formatLabel(selectedPayment.status)}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Customer</h4>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="font-medium text-gray-900">{selectedPayment.customer}</p>
                  <p className="text-sm text-gray-600">{selectedPayment.email || "No email"}</p>
                  {selectedPayment.bookingId && (
                    <p className="mt-1 text-xs text-gray-500">Booking #{selectedPayment.bookingId}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Payment</h4>
                <div className="space-y-3 rounded-lg border border-gray-200 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Method</span>
                    <span className="font-medium text-gray-900">{selectedPayment.methodLabel}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium text-gray-900">{formatAmount(selectedPayment.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Reference</span>
                    <span className="font-medium text-gray-900">{selectedPayment.transactionId || "No reference"}</span>
                  </div>
                  {selectedPayment.cardLast4 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Card</span>
                      <span className="font-medium text-gray-900">**** {selectedPayment.cardLast4}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Status</h4>
                <select
                  value={selectedPayment.status}
                  disabled={savingId === selectedPayment.id}
                  onChange={(event) => handleStatusChange(selectedPayment, event.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{formatLabel(status)}</option>
                  ))}
                </select>
              </div>

              {selectedPayment.notes && (
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="text-sm font-medium text-gray-700">Notes</h4>
                  <p className="mt-2 text-sm text-gray-600">{selectedPayment.notes}</p>
                </div>
              )}

              <button
                type="button"
                disabled={savingId === selectedPayment.id}
                onClick={() => handleDelete(selectedPayment)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                <Trash2 size={16} />
                Delete Payment
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default Payments;