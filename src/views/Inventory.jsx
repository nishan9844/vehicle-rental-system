import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Car,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { deleteVehicle, getVehicles } from "../services/vehicleService";

const fallbackImage =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&h=600&fit=crop";

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

function formatStatus(status) {
  return String(status || "available")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getStatusColor(status) {
  const value = String(status || "").toLowerCase();

  if (value === "available") return "bg-green-50 text-green-700 border-green-200";
  if (value === "rented" || value === "in rental") return "bg-blue-50 text-blue-700 border-blue-200";
  if (value === "maintenance") return "bg-yellow-50 text-yellow-700 border-yellow-200";

  return "bg-gray-50 text-gray-700 border-gray-200";
}

function normalizeVehicle(vehicle) {
  const vehicleType = pickValue(vehicle, ["vehicle_type", "category", "type"], "Vehicle");

  return {
    raw: vehicle,
    id: vehicle.id,
    name: pickValue(vehicle, ["name"], "Vehicle"),
    brand: pickValue(vehicle, ["brand"], ""),
    model: pickValue(vehicle, ["model"], ""),
    type: vehicleType,
    fuel: pickValue(vehicle, ["fuel_type", "type"], ""),
    transmission: pickValue(vehicle, ["transmission"], ""),
    seats: pickValue(vehicle, ["seats"], ""),
    price: pickValue(vehicle, ["price_per_day", "price"], 0),
    status: pickValue(vehicle, ["status"], "AVAILABLE"),
    image: pickValue(vehicle, ["image_url", "image"], fallbackImage),
    published: vehicle.is_published !== false,
  };
}

export default function Inventory() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    setLoading(true);
    setError("");

    try {
      const data = await getVehicles();
      setVehicles(data || []);
    } catch (err) {
      setError(err.message || "Unable to load vehicles.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(vehicle) {
    if (!window.confirm(`Delete ${vehicle.name}? This cannot be undone.`)) return;

    setSavingId(vehicle.id);
    setError("");
    setNotice("");

    try {
      await deleteVehicle(vehicle.id);
      setVehicles((current) => current.filter((item) => String(item.id) !== String(vehicle.id)));
      setNotice(`${vehicle.name} deleted successfully.`);
    } catch (err) {
      setError(err.message || "Unable to delete vehicle.");
    } finally {
      setSavingId(null);
    }
  }

  const normalizedVehicles = useMemo(() => vehicles.map(normalizeVehicle), [vehicles]);

  const filteredVehicles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return normalizedVehicles.filter((vehicle) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        String(vehicle.status || "").toLowerCase() === statusFilter.toLowerCase();
      const matchesSearch =
        !term ||
        [vehicle.name, vehicle.brand, vehicle.model, vehicle.type, vehicle.fuel].some((value) =>
          String(value || "").toLowerCase().includes(term)
        );

      return matchesStatus && matchesSearch;
    });
  }, [normalizedVehicles, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const available = normalizedVehicles.filter((vehicle) =>
      String(vehicle.status || "").toLowerCase().includes("available")
    ).length;
    const maintenance = normalizedVehicles.filter((vehicle) =>
      String(vehicle.status || "").toLowerCase().includes("maintenance")
    ).length;

    return {
      total: normalizedVehicles.length,
      available,
      maintenance,
    };
  }, [normalizedVehicles]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Inventory</h1>
          <p className="mt-1 text-gray-600">Manage the fleet shown on the user site.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={loadVehicles}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <Link
            to="/vehicles/add"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Vehicle
          </Link>
        </div>
      </div>

      {(notice || error) && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || notice}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Car size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Available</p>
          <p className="mt-2 text-2xl font-bold text-green-700">{stats.available}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Maintenance</p>
          <p className="mt-2 text-2xl font-bold text-yellow-700">{stats.maintenance}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-xl flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, brand, type..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500"
          >
            <option value="ALL">All statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="RENTED">Rented</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-gray-600">Loading vehicles...</div>
        ) : filteredVehicles.length === 0 ? (
          <div className="p-12 text-center">
            <Car size={34} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "ALL"
                ? "No vehicles match your filters."
                : "No vehicles yet. Add your first vehicle to publish it on the user site."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left text-sm font-medium text-gray-600">
                  <th className="p-4">Vehicle</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Seats</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Published</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          className="h-12 w-16 rounded-lg object-cover"
                          onError={(event) => {
                            event.currentTarget.src = fallbackImage;
                          }}
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{vehicle.name}</p>
                          <p className="text-xs text-gray-500">
                            {[vehicle.brand, vehicle.model].filter(Boolean).join(" ")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      <p>{vehicle.type}</p>
                      {vehicle.fuel && <p className="text-xs text-gray-400">{vehicle.fuel}</p>}
                    </td>
                    <td className="p-4 text-sm text-gray-700">{vehicle.seats || "-"}</td>
                    <td className="p-4 font-semibold text-gray-900">{formatMoney(vehicle.price)}</td>
                    <td className="p-4">
                      <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                        {formatStatus(vehicle.status)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{vehicle.published ? "Yes" : "No"}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/vehicles/${vehicle.id}/edit`}
                          className="rounded-lg border border-gray-200 px-2 py-1.5 text-gray-600 hover:bg-gray-50"
                          title="Edit vehicle"
                        >
                          <Edit3 size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(vehicle)}
                          disabled={savingId === vehicle.id}
                          className="rounded-lg border border-red-200 px-2 py-1.5 text-red-600 hover:bg-red-50 disabled:opacity-60"
                          title="Delete vehicle"
                        >
                          <Trash2 size={14} />
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
  );
}
