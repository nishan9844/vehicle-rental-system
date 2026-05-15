import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Car, Save, User } from "lucide-react";
import { createBooking } from "../services/bookingService";
import { getCustomers } from "../services/customerService";
import { getVehicles } from "../services/vehicleService";

const emptyForm = {
  customerId: "",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  vehicleId: "",
  pickupDate: "",
  returnDate: "",
  amount: "",
  notes: "",
};

function getVehicleName(vehicle) {
  return [vehicle.brand, vehicle.name].filter(Boolean).join(" ") || vehicle.name || `Vehicle ${vehicle.id}`;
}

function getCustomerName(customer) {
  return customer.name || customer.full_name || customer.customer_name || `Customer ${customer.id}`;
}

function getDailyPrice(vehicle) {
  return Number(vehicle?.price || vehicle?.daily_rate || vehicle?.rate || 0);
}

function calculateDays(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate <= startDate) {
    return 1;
  }

  return Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
}

const NewRental = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyForm);
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOptions() {
      setLoading(true);
      setError("");

      try {
        const [vehicleRows, customerRows] = await Promise.all([
          getVehicles(),
          getCustomers().catch(() => []),
        ]);

        if (active) {
          setVehicles(vehicleRows || []);
          setCustomers(customerRows || []);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load rental options.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadOptions();

    return () => {
      active = false;
    };
  }, []);

  const selectedVehicle = useMemo(() => {
    return vehicles.find((vehicle) => String(vehicle.id) === String(formData.vehicleId));
  }, [formData.vehicleId, vehicles]);

  const rentalDays = useMemo(() => {
    return calculateDays(formData.pickupDate, formData.returnDate);
  }, [formData.pickupDate, formData.returnDate]);

  const estimatedAmount = useMemo(() => {
    return getDailyPrice(selectedVehicle) * rentalDays;
  }, [rentalDays, selectedVehicle]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
    setError("");
  }

  function handleCustomerSelect(event) {
    const customerId = event.target.value;
    const customer = customers.find((item) => String(item.id) === String(customerId));

    setFormData((current) => ({
      ...current,
      customerId,
      customerName: customer ? getCustomerName(customer) : "",
      customerEmail: customer?.email || customer?.customer_email || "",
      customerPhone: customer?.phone || customer?.customer_phone || customer?.mobile || "",
    }));
    setError("");
  }

  function handleVehicleSelect(event) {
    const vehicleId = event.target.value;
    const vehicle = vehicles.find((item) => String(item.id) === String(vehicleId));
    const amount = vehicle && formData.pickupDate && formData.returnDate
      ? getDailyPrice(vehicle) * calculateDays(formData.pickupDate, formData.returnDate)
      : formData.amount;

    setFormData((current) => ({
      ...current,
      vehicleId,
      amount: amount ? String(amount) : current.amount,
    }));
    setError("");
  }

  function syncEstimatedAmount() {
    setFormData((current) => ({
      ...current,
      amount: estimatedAmount ? String(estimatedAmount) : current.amount,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const vehicleName = selectedVehicle ? getVehicleName(selectedVehicle) : "";

      await createBooking({
        customer_id: formData.customerId || null,
        customer_name: formData.customerName.trim(),
        customer_email: formData.customerEmail.trim(),
        customer_phone: formData.customerPhone.trim(),
        vehicle_id: formData.vehicleId || null,
        vehicle_name: vehicleName,
        vehicle_image: selectedVehicle?.image || null,
        pickup_date: formData.pickupDate,
        return_date: formData.returnDate,
        amount: Number(formData.amount || estimatedAmount || 0),
        subtotal: Number(formData.amount || estimatedAmount || 0),
        status: "pending",
        payment_status: "pending",
        notes: formData.notes.trim(),
      });

      navigate("/bookings", {
        state: { message: "Rental booking created successfully." },
      });
    } catch (err) {
      setError(err.message || "Unable to create rental booking.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-gray-600 shadow-sm">
        Loading rental form...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/bookings")}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to bookings
          </button>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">New Rental</h1>
          <p className="mt-1 text-gray-600">Create a new customer rental booking.</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <User size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Customer</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-gray-700">Existing customer</span>
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleCustomerSelect}
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Manual customer entry</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {getCustomerName(customer)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Customer name</span>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Phone</span>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <Car size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Vehicle & Dates</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-gray-700">Vehicle</span>
                <select
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleVehicleSelect}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {getVehicleName(vehicle)} - NPR {getDailyPrice(vehicle)} / day
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Pickup date</span>
                <input
                  type="datetime-local"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Return date</span>
                <input
                  type="datetime-local"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Amount</span>
                <input
                  type="number"
                  min="0"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-gray-700">Notes</span>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>
          </section>
        </div>

        <aside className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Calendar size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
          </div>

          <div className="mt-5 space-y-4 text-sm">
            <div>
              <p className="font-semibold text-gray-900">{formData.customerName || "Customer"}</p>
              <p className="text-gray-500">{formData.customerPhone || formData.customerEmail || "Contact details"}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Vehicle</p>
              <p className="mt-1 font-medium text-gray-900">
                {selectedVehicle ? getVehicleName(selectedVehicle) : "Not selected"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase text-gray-500">Days</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{rentalDays}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase text-gray-500">Estimate</p>
                <p className="mt-1 text-xl font-bold text-gray-900">NPR {estimatedAmount || 0}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={syncEstimatedAmount}
              disabled={!estimatedAmount}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Use Estimate
            </button>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-5">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Creating..." : "Create Rental"}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default NewRental;