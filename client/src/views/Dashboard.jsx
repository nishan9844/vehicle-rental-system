import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import {
  ArrowRight,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  RefreshCw,
  Star,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import StatCard from "../components/StatCard";
import { getBookings } from "../services/bookingService";
import { getCustomers } from "../services/customerService";
import { getPayments } from "../services/paymentService";
import { getVehicles } from "../services/vehicleService";

function pickValue(source, keys, fallback = "") {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null && source?.[key] !== "") {
      return source[key];
    }
  }

  return fallback;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-NP").format(Number(value || 0));
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatShortMoney(value) {
  const amount = Number(value || 0);

  if (amount >= 100000) {
    return `NPR ${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)}L`;
  }

  if (amount >= 1000) {
    return `NPR ${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
  }

  return formatMoney(amount);
}

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "No date";

  return date.toLocaleDateString("en-NP", {
    month: "short",
    day: "numeric",
  });
}

function isToday(value) {
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toDateString() === new Date().toDateString();
}

function isFuture(value) {
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date >= new Date();
}

function normalizeStatus(value, fallback = "pending") {
  return String(value || fallback).toLowerCase();
}

function getBookingPickupDate(booking) {
  return pickValue(booking, ["pickup_date", "pickupDate", "start_date", "startDate", "from_date"]);
}

function getBookingReturnDate(booking) {
  return pickValue(booking, ["return_date", "returnDate", "end_date", "endDate", "to_date"]);
}

function getPaymentAmount(payment) {
  return Number(pickValue(payment, ["amount", "total", "paid_amount", "paidAmount"], 0));
}

function getPaymentDate(payment) {
  return pickValue(payment, ["date", "paid_at", "paidAt", "payment_date", "paymentDate", "created_at", "createdAt"]);
}

function groupRevenueByMonth(payments) {
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const currentYear = new Date().getFullYear();
  const totals = months.map((name) => ({ name, value: 0 }));

  payments.forEach((payment) => {
    const status = normalizeStatus(payment.status);
    const date = new Date(getPaymentDate(payment));

    if (status !== "paid" || Number.isNaN(date.getTime()) || date.getFullYear() !== currentYear) {
      return;
    }

    totals[date.getMonth()].value += getPaymentAmount(payment);
  });

  return totals;
}

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    setLoading(true);
    setError("");

    const [vehicleResult, bookingResult, customerResult, paymentResult] = await Promise.allSettled([
      getVehicles(),
      getBookings(),
      getCustomers(),
      getPayments(),
    ]);

    if (vehicleResult.status === "fulfilled") setVehicles(vehicleResult.value || []);
    if (bookingResult.status === "fulfilled") setBookings(bookingResult.value || []);
    if (customerResult.status === "fulfilled") setCustomers(customerResult.value || []);
    if (paymentResult.status === "fulfilled") setPayments(paymentResult.value || []);

    const failed = [vehicleResult, bookingResult, customerResult, paymentResult]
      .filter((result) => result.status === "rejected")
      .map((result) => result.reason?.message)
      .filter(Boolean);

    if (failed.length) {
      setError(failed[0]);
    }

    setLoading(false);
  }

  const metrics = useMemo(() => {
    const availableVehicles = vehicles.filter((vehicle) => normalizeStatus(vehicle.status, "") === "available").length;
    const activeBookings = bookings.filter((booking) =>
      ["active", "confirmed"].includes(normalizeStatus(booking.status))
    ).length;
    const upcomingPickups = bookings.filter((booking) => isFuture(getBookingPickupDate(booking))).length;
    const pendingCustomers = customers.filter((customer) =>
      ["pending", "pending_doc", "unverified"].includes(normalizeStatus(customer.verification || customer.status))
    ).length;
    const paidPayments = payments.filter((payment) => normalizeStatus(payment.status) === "paid");
    const pendingPayments = payments.filter((payment) => normalizeStatus(payment.status) === "pending").length;
    const revenue = paidPayments.reduce((sum, payment) => sum + getPaymentAmount(payment), 0);

    return {
      totalVehicles: vehicles.length,
      availableVehicles,
      activeBookings,
      upcomingPickups,
      totalCustomers: customers.length,
      pendingCustomers,
      revenue,
      pendingPayments,
    };
  }, [bookings, customers, payments, vehicles]);

  const revenueData = useMemo(() => groupRevenueByMonth(payments), [payments]);

  const bookingFlow = useMemo(() => {
    return [
      {
        label: "Today's Bookings",
        count: bookings.filter((booking) => isToday(booking.created_at || getBookingPickupDate(booking))).length,
        icon: Calendar,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        label: "Upcoming Returns",
        count: bookings.filter((booking) => isFuture(getBookingReturnDate(booking))).length,
        icon: ArrowRight,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        rotate: -45,
      },
      {
        label: "Upcoming Pickups",
        count: bookings.filter((booking) => isFuture(getBookingPickupDate(booking))).length,
        icon: ArrowRight,
        color: "text-blue-600",
        bg: "bg-blue-50",
        rotate: 45,
      },
      {
        label: "Cancelled",
        count: bookings.filter((booking) => normalizeStatus(booking.status) === "cancelled").length,
        icon: Clock,
        color: "text-red-600",
        bg: "bg-red-50",
      },
    ];
  }, [bookings]);

  const vehicleDistribution = useMemo(() => {
    const ev = vehicles.filter((vehicle) =>
      String(vehicle.type || vehicle.category || "").toLowerCase().includes("electric")
      || String(vehicle.category || "").toLowerCase().includes("ev")
    ).length;
    const twoWheelers = vehicles.filter((vehicle) =>
      ["bike", "scooter", "motorcycle", "2-wheeler"].some((type) =>
        String(vehicle.category || vehicle.type || "").toLowerCase().includes(type)
      )
    ).length;
    const fourWheelers = Math.max(0, vehicles.length - twoWheelers);

    return { ev, twoWheelers, fourWheelers };
  }, [vehicles]);

  const activities = useMemo(() => {
    const bookingActivities = bookings.slice(0, 2).map((booking) => ({
      type: "booking",
      user: pickValue(booking, ["customer_name", "customerName", "name"], "Customer"),
      detail: pickValue(booking, ["vehicle_name", "vehicleName", "vehicle"], "Rental booking"),
      time: formatDate(booking.created_at || getBookingPickupDate(booking)),
      icon: Calendar,
      iconBg: "bg-blue-50 text-blue-600",
    }));

    const paymentActivities = payments.slice(0, 2).map((payment) => ({
      type: "payment",
      user: `Payment ${normalizeStatus(payment.status)}`,
      detail: `${pickValue(payment, ["transaction_id", "transactionId"], `PAY-${payment.id}`)} - ${formatMoney(getPaymentAmount(payment))}`,
      time: formatDate(getPaymentDate(payment)),
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 text-emerald-600",
    }));

    const vehicleActivities = vehicles.slice(0, 1).map((vehicle) => ({
      type: "vehicle",
      user: `Vehicle added: ${vehicle.name || `Vehicle ${vehicle.id}`}`,
      detail: [vehicle.brand, vehicle.category].filter(Boolean).join(" - ") || "Fleet inventory",
      time: formatDate(vehicle.created_at),
      icon: Car,
      iconBg: "bg-purple-50 text-purple-600",
    }));

    const customerActivities = customers.slice(0, 1).map((customer) => ({
      type: "customer",
      user: `Customer profile: ${customer.name || customer.full_name || `Customer ${customer.id}`}`,
      detail: customer.email || customer.phone || "Customer directory",
      time: formatDate(customer.created_at),
      icon: FileText,
      iconBg: "bg-orange-50 text-orange-600",
    }));

    return [...bookingActivities, ...paymentActivities, ...vehicleActivities, ...customerActivities].slice(0, 5);
  }, [bookings, customers, payments, vehicles]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Summary</h1>
          <p className="text-gray-600 mt-1">
            {loading ? "Loading live metrics..." : "Live overview of your rental operations."}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={fetchDashboard}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <Link
            to="/vehicles/add"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus size={16} />
            Add Vehicle
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          Some dashboard data could not be loaded: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Vehicles" value={formatNumber(metrics.totalVehicles)} trend="up" trendValue="Live" icon={Car} iconBg="bg-blue-600/20 text-blue-400" subValue={`${formatNumber(metrics.availableVehicles)} Available`} />
        <StatCard title="Active Bookings" value={formatNumber(metrics.activeBookings)} trend="up" trendValue="Live" icon={Calendar} iconBg="bg-purple-600/20 text-purple-400" subValue={`${formatNumber(metrics.upcomingPickups)} upcoming pickups`} />
        <StatCard title="Total Customers" value={formatNumber(metrics.totalCustomers)} trend="up" trendValue="Live" icon={Users} iconBg="bg-indigo-600/20 text-indigo-400" subValue={`${formatNumber(metrics.pendingCustomers)} pending verification`} />
        <StatCard title="Total Revenue" value={formatShortMoney(metrics.revenue)} trend="up" trendValue="Live" icon={Wallet} iconBg="bg-emerald-600/20 text-emerald-400" subValue={`${formatNumber(metrics.pendingPayments)} pending payments`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
              <p className="text-xs text-gray-500">Paid payment totals grouped by month.</p>
            </div>
          </div>

          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }} dy={10} />
                <Tooltip formatter={(value) => formatMoney(value)} cursor={{ fill: "rgba(59,130,246,0.05)" }} contentStyle={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", fontSize: "12px", color: "#1a1a1a" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={index === new Date().getMonth() ? "#0f467e" : "#e2e8f0"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Booking Flow</h3>
          <div className="space-y-4">
            {bookingFlow.map((item) => (
              <Link key={item.label} to="/bookings" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                    <item.icon size={20} style={item.rotate ? { transform: `rotate(${item.rotate}deg)` } : {}} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{item.label}</p>
                    <p className="text-xl font-bold text-gray-900">{item.count}</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Vehicle Distribution</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center justify-center gap-2">
                <Zap className="text-emerald-600" size={24} />
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{vehicleDistribution.ev}</p>
                  <p className="text-[10px] font-bold uppercase text-gray-500">EV Vehicle</p>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center justify-center gap-2">
                <Car className="text-blue-600" size={24} />
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{vehicleDistribution.fourWheelers}</p>
                  <p className="text-[10px] font-bold uppercase text-gray-500">4-Wheelers</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-3">
                <Car className="text-indigo-600" size={24} />
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{vehicleDistribution.twoWheelers}</p>
                  <p className="text-[10px] font-bold uppercase text-gray-500">2-Wheelers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Live Activities</h3>
            <Link to="/bookings" className="text-blue-600 text-xs font-bold hover:underline">View All</Link>
          </div>
          <div className="space-y-6">
            {activities.length === 0 ? (
              <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
                No recent activity yet.
              </div>
            ) : activities.map((activity, index) => (
              <div key={`${activity.type}-${index}`} className="flex gap-4">
                <div className="relative">
                  <div className={`p-2 rounded-lg relative z-10 ${activity.iconBg}`}>
                    <activity.icon size={16} />
                  </div>
                  {index !== activities.length - 1 && <div className="absolute top-8 bottom-[-24px] left-1/2 w-px bg-gray-200 -translate-x-1/2"></div>}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{activity.user}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.detail}</p>
                      {activity.star && (
                        <div className="flex gap-0.5 mt-2">
                          {[...Array(activity.star)].map((_, i) => <Star key={i} size={10} className="fill-orange-400 text-orange-400" />)}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;