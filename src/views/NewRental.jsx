import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarPlus, Save } from "lucide-react";
import { adminApi } from "../services/adminApi";
import { getVehicles } from "../services/vehicleService";

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  vehicle_id: "",
  pickup_date: "",
  return_date: "",
  total_price: "",
  deposit: "0",
  status: "confirmed",
  payment_status: "unpaid",
  notes: "",
};

export default function NewRental() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [vehicles, setVehicles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getVehicles()
      .then((data) => {
        if (active) setVehicles(data || []);
      })
      .catch(() => {
        if (active) setVehicles([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const selectedVehicle = useMemo(() => {
    return vehicles.find((vehicle) => String(vehicle.id) === String(form.vehicle_id));
  }, [form.vehicle_id, vehicles]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "vehicle_id" && value
        ? { total_price: current.total_price || String(selectedVehicle?.price_per_day || "") }
        : {}),
    }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await adminApi("/api/admin/bookings", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          subtotal: Number(form.total_price || 0),
          total_price: Number(form.total_price || 0),
          deposit: Number(form.deposit || 0),
        }),
      });

      navigate("/bookings", {
        state: { message: "Rental created successfully." },
      });
    } catch (err) {
      setError(err.message || "Unable to create rental.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">New Rental</h1>
        <p className="mt-1 text-gray-600">Create a manual rental booking for a customer.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarPlus size={22} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Rental Details</h2>
              <p className="text-sm text-gray-500">Fill in the customer and rental period.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Customer Name</span>
              <input name="full_name" value={form.full_name} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Phone</span>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Vehicle</span>
              <select name="vehicle_id" value={form.vehicle_id} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                <option value="">No vehicle selected</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} {vehicle.brand ? `- ${vehicle.brand}` : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Pickup Date</span>
              <input type="date" name="pickup_date" value={form.pickup_date} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Return Date</span>
              <input type="date" name="return_date" value={form.return_date} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Total Price (NPR)</span>
              <input type="number" min="0" name="total_price" value={form.total_price} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Security Deposit</span>
              <input type="number" min="0" name="deposit" value={form.deposit} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Booking Status</span>
              <select name="status" value={form.status} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Payment Status</span>
              <select name="payment_status" value={form.payment_status} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                <option value="unpaid">Unpaid</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-gray-700">Notes</span>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>
          </div>

          <div className="mt-6 flex justify-end">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-60">
              <Save size={16} />
              {saving ? "Creating..." : "Create Rental"}
            </button>
          </div>
        </div>

        <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm self-start">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Summary</p>
          <h2 className="mt-3 text-xl font-bold text-gray-900">{form.full_name || "Customer"}</h2>
          <div className="mt-5 space-y-3 text-sm text-gray-600">
            <p><span className="font-medium text-gray-900">Vehicle:</span> {selectedVehicle?.name || "Not selected"}</p>
            <p><span className="font-medium text-gray-900">Pickup:</span> {form.pickup_date || "Not set"}</p>
            <p><span className="font-medium text-gray-900">Return:</span> {form.return_date || "Not set"}</p>
            <p><span className="font-medium text-gray-900">Payment:</span> {form.payment_status}</p>
          </div>
          <div className="mt-6 rounded-xl bg-blue-50 p-4">
            <p className="text-xs font-bold uppercase text-blue-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">NPR {Number(form.total_price || 0).toLocaleString("en-NP")}</p>
          </div>
        </aside>
      </form>
    </div>
  );
}
