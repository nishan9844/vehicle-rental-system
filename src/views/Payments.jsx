import React, { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    CheckCircle,
    Clock,
    CreditCard,
    Download,
    RefreshCw,
    Search,
    Trash2,
    TrendingUp,
    Wallet,
    X,
    XCircle,
} from "lucide-react";
import { deletePayment, getPayments, updatePaymentStatus } from "../services/paymentService";

const statusOptions = ["paid", "completed", "pending", "failed", "refunded"];
const methodTabs = ["all", "card", "esewa", "khalti", "cash"];
const dateFilters = [
    { label: "Last 7 Days", value: "7" },
    { label: "Last 30 Days", value: "30" },
    { label: "Last 3 Months", value: "90" },
    { label: "All Time", value: "all" },
];

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
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
}

function formatAmount(amount) {
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
    return date.toLocaleDateString("en-NP", { month: "short", day: "numeric", year: "numeric" });
}

function getPaymentDate(payment) {
    return pickValue(payment, ["paid_at", "paidAt", "date", "payment_date", "created_at"]);
}

function normalizeMethod(method) {
    const v = String(method || "card").toLowerCase();
    if (["visa", "mastercard", "credit_card", "debit_card"].includes(v)) return "card";
    return v;
}

function normalizeStatus(status) {
    const value = String(status || "pending").toLowerCase();
    return value === "completed" ? "paid" : value;
}

function normalizePayment(payment) {
    const method = normalizeMethod(pickValue(payment, ["method", "payment_method"], "card"));
    const amount = pickValue(payment, ["amount", "total", "paid_amount"], payment.bookings?.total_price || 0);
    const date = getPaymentDate(payment) || new Date().toISOString();

    return {
        raw: payment,
        id: payment.id,
        synthetic: Boolean(payment.synthetic),
        displayId: payment.payment_code || payment.transaction_id || `PAY-${String(payment.id).slice(0, 8)}`,
        bookingId: pickValue(payment, ["booking_id", "bookingId"], ""),
        customer: pickValue(payment, ["customer_name", "customerName"], payment.bookings?.full_name || "Unknown"),
        email: pickValue(payment, ["customer_email", "email"], payment.bookings?.email || ""),
        method,
        methodLabel: formatLabel(method),
        amount: Number(amount || 0),
        status: normalizeStatus(pickValue(payment, ["status"], "pending")),
        rawStatus: String(pickValue(payment, ["status"], "pending")).toLowerCase(),
        date,
        transactionId: pickValue(payment, ["transaction_id", "transactionId", "gateway_reference"], ""),
        notes: pickValue(payment, ["notes", "remarks"], ""),
        // From joined booking relation
        vehicleName: payment.bookings?.vehicles?.name || "",
        pickupDate: payment.bookings?.pickup_date || "",
        returnDate: payment.bookings?.return_date || "",
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

function isWithinDateFilter(payment, dateFilter) {
    if (dateFilter === "all") return true;
    const date = new Date(payment.date);
    if (Number.isNaN(date.getTime())) return false;
    const start = new Date();
    start.setDate(start.getDate() - Number(dateFilter));
    return date >= start;
}

// ─── component ────────────────────────────────────────────────────────────────

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
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
            setPayments(Array.isArray(data) ? data : []);
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
            const normalized = normalizePayment(updated);
            setPayments((cur) => cur.map((item) => (item.id === payment.id ? updated : item)));
            setSelectedPayment((cur) => (cur?.id === payment.id ? normalized : cur));
            setNotice(`${normalized.displayId} status changed to ${formatLabel(status)}.`);
        } catch (err) {
            setError(err.message || "Unable to update payment status.");
        } finally {
            setSavingId(null);
        }
    }

    async function handleDelete(payment) {
        if (!window.confirm(`Delete payment ${payment.displayId}? This cannot be undone.`)) return;
        setSavingId(payment.id);
        setError("");
        setNotice("");
        try {
            await deletePayment(payment.id);
            setPayments((cur) => cur.filter((item) => item.id !== payment.id));
            setSelectedPayment((cur) => (cur?.id === payment.id ? null : cur));
            setNotice("Payment deleted successfully.");
        } catch (err) {
            setError(err.message || "Unable to delete payment.");
        } finally {
            setSavingId(null);
        }
    }

    const normalizedPayments = useMemo(() => payments.map(normalizePayment), [payments]);

    const filteredPayments = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return normalizedPayments.filter((p) => {
            const matchesMethod = activeTab === "all" || p.method === activeTab;
            const matchesDate = isWithinDateFilter(p, dateFilter);
            const matchesSearch =
                !term ||
                [p.displayId, p.transactionId, p.customer, p.email, p.method, p.status, p.vehicleName].some((v) =>
                    String(v || "").toLowerCase().includes(term)
                );
            return matchesMethod && matchesDate && matchesSearch;
        });
    }, [normalizedPayments, searchTerm, activeTab, dateFilter]);

    const summaryCards = useMemo(() => {
        const totalRevenue = normalizedPayments
            .filter((p) => p.status === "paid")
            .reduce((s, p) => s + p.amount, 0);
        const pendingDeposits = normalizedPayments
            .filter((p) => p.status === "pending")
            .reduce((s, p) => s + p.amount, 0);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weeklyRefunds = normalizedPayments
            .filter((p) => {
                const d = new Date(p.date);
                return p.status === "refunded" && !Number.isNaN(d.getTime()) && d >= weekAgo;
            })
            .reduce((s, p) => s + p.amount, 0);

        return [
            { title: "Total Revenue (Paid)", value: formatAmount(totalRevenue), icon: TrendingUp, color: "bg-green-500" },
            { title: "Pending Deposits", value: formatAmount(pendingDeposits), icon: Clock, color: "bg-yellow-500" },
            { title: "Weekly Refunds", value: formatAmount(weeklyRefunds), icon: RefreshCw, color: "bg-red-500" },
        ];
    }, [normalizedPayments]);

    function handleExportCsv() {
        if (filteredPayments.length === 0) return;
        const headers = ["ID", "Customer", "Email", "Method", "Amount (NPR)", "Status", "Date", "Transaction ID", "Vehicle", "Pickup", "Return"];
        const rows = filteredPayments.map((p) => [
            p.displayId, p.customer, p.email, p.method, p.amount, p.status,
            formatDate(p.date), p.transactionId, p.vehicleName,
            formatDateShort(p.pickupDate), formatDateShort(p.returnDate),
        ]);
        const csv = [headers, ...rows]
            .map((row) => row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
            .join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `payments-${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
                    <p className="text-gray-600">All payment transactions from the user site, live from Supabase.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportCsv}
                        disabled={filteredPayments.length === 0}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                        <Download size={16} />
                        Export CSV
                    </button>
                    <button
                        onClick={fetchPayments}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                        Refresh
                    </button>
                </div>
            </div>

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {summaryCards.map((card) => (
                    <div key={card.title} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                                <card.icon size={24} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{card.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Method Tabs */}
            <div className="flex gap-2 flex-wrap">
                {methodTabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${activeTab === tab
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            }`}
                    >
                        {formatLabel(tab)}
                    </button>
                ))}
            </div>

            {/* Table area */}
            <div className={`flex gap-0 transition-all duration-300 ${selectedPayment ? "" : ""}`}>
                <div className={`flex-1 ${selectedPayment ? "mr-96" : ""}`}>
                    {/* Search + Date filter */}
                    <div className="mb-4 flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by customer, ID, vehicle, method..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-3 rounded-lg text-sm"
                            />
                        </div>
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900"
                        >
                            {dateFilters.map((f) => (
                                <option key={f.value} value={f.value}>{f.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        {loading ? (
                            <div className="p-8 text-gray-600">Loading payments from Supabase...</div>
                        ) : filteredPayments.length === 0 ? (
                            <div className="p-10 text-center text-gray-500">
                                No payments found.{" "}
                                {!searchTerm && activeTab === "all" && dateFilter === "all"
                                    ? "Payments appear here after users complete checkout on the user site."
                                    : "Try adjusting your filters."}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 text-left text-sm font-medium text-gray-600">
                                            <th className="p-4">ID</th>
                                            <th className="p-4">Customer</th>
                                            <th className="p-4">Vehicle</th>
                                            <th className="p-4">Method</th>
                                            <th className="p-4">Amount</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPayments.map((payment) => {
                                            const badge = getStatusBadge(payment.status);
                                            const BadgeIcon = badge.icon;
                                            const MethodIcon = ["esewa", "khalti", "cash"].includes(payment.method)
                                                ? Wallet
                                                : CreditCard;
                                            return (
                                                <tr
                                                    key={payment.id}
                                                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                                                    onClick={() => setSelectedPayment(payment)}
                                                >
                                                    <td className="p-4 text-sm font-medium text-gray-900">{payment.displayId}</td>
                                                    <td className="p-4">
                                                        <p className="font-medium text-gray-900">{payment.customer}</p>
                                                        <p className="text-xs text-gray-500">{payment.email}</p>
                                                    </td>
                                                    <td className="p-4 text-sm text-gray-700">
                                                        {payment.vehicleName || <span className="text-gray-400">—</span>}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <MethodIcon size={14} className="text-gray-400" />
                                                            {payment.methodLabel}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 font-medium">{formatAmount(payment.amount)}</td>
                                                    <td className="p-4">
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}
                                                        >
                                                            <BadgeIcon size={12} />
                                                            {formatLabel(payment.status)}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-sm text-gray-600">{formatDate(payment.date)}</td>
                                                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex gap-2">
                                                            {!payment.synthetic && payment.status !== "paid" && (
                                                                <button
                                                                    onClick={() => handleStatusChange(payment, "paid")}
                                                                    disabled={savingId === payment.id}
                                                                    className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-60"
                                                                >
                                                                    Mark Paid
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDelete(payment)}
                                                                disabled={savingId === payment.id || payment.synthetic}
                                                                title={payment.synthetic ? "Generated from a paid booking without a payment row" : "Delete payment"}
                                                                className="rounded-lg border border-red-200 px-2 py-1.5 text-red-600 hover:bg-red-50 disabled:opacity-60"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Detail Panel */}
            {selectedPayment && (
                <aside className="fixed right-0 top-20 z-20 h-[calc(100vh-5rem)] w-96 overflow-y-auto border-l border-gray-200 bg-white shadow-xl">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold">Payment Details</h2>
                            <button onClick={() => setSelectedPayment(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div><p className="text-gray-500">Payment ID</p><p className="font-medium">{selectedPayment.displayId}</p></div>
                            <div><p className="text-gray-500">Customer</p><p className="font-medium">{selectedPayment.customer}</p></div>
                            <div><p className="text-gray-500">Email</p><p>{selectedPayment.email}</p></div>
                            {selectedPayment.vehicleName && (
                                <div><p className="text-gray-500">Vehicle</p><p className="font-medium">{selectedPayment.vehicleName}</p></div>
                            )}
                            {selectedPayment.pickupDate && (
                                <div><p className="text-gray-500">Rental Period</p><p>{formatDateShort(selectedPayment.pickupDate)} → {formatDateShort(selectedPayment.returnDate)}</p></div>
                            )}
                            <div><p className="text-gray-500">Method</p><p className="font-medium">{selectedPayment.methodLabel}</p></div>
                            <div><p className="text-gray-500">Amount</p><p className="font-bold text-lg text-gray-900">{formatAmount(selectedPayment.amount)}</p></div>
                            <div><p className="text-gray-500">Transaction ID</p><p className="font-mono text-xs break-all">{selectedPayment.transactionId || "—"}</p></div>
                            <div><p className="text-gray-500">Paid At</p><p>{formatDate(selectedPayment.date)}</p></div>
                            {selectedPayment.bookingId && (
                                <div><p className="text-gray-500">Booking ID</p><p className="font-mono text-xs">{selectedPayment.bookingId}</p></div>
                            )}
                            <div>
                                <p className="text-gray-500 mb-2">Update Status</p>
                                <select
                                    value={selectedPayment.status}
                                    onChange={(e) => handleStatusChange(selectedPayment, e.target.value)}
                                    disabled={savingId === selectedPayment.id}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-500"
                                >
                                    {statusOptions.map((s) => (
                                        <option key={s} value={s}>{formatLabel(s)}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={() => handleDelete(selectedPayment)}
                                disabled={savingId === selectedPayment.id}
                                className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-red-600 hover:bg-red-50 disabled:opacity-60"
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
