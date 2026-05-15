import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Car, Edit, Plus, Search, Trash2 } from "lucide-react";
import { deleteVehicle, getVehicles } from "../services/vehicleService";

const fallbackImage = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&h=600&fit=crop";

function statusClass(status) {
    switch (status) {
        case "AVAILABLE":
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "IN RENTAL":
            return "bg-blue-50 text-blue-700 border-blue-200";
        case "MAINTENANCE":
            return "bg-amber-50 text-amber-700 border-amber-200";
        default:
            return "bg-gray-50 text-gray-700 border-gray-200";
    }
}

const Inventory = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState(location.state?.message || "");

    useEffect(() => {
        if (location.state?.message) {
            navigate(location.pathname, { replace: true, state: null });
        }
    }, [location.pathname, location.state, navigate]);

    useEffect(() => {
        fetchVehicles();
    }, []);

    async function fetchVehicles() {
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
        const confirmDelete = window.confirm(
            `Delete ${vehicle.name}? This action cannot be undone.`
        );

        if (!confirmDelete) return;

        setDeletingId(vehicle.id);
        setError("");
        setNotice("");

        try {
            await deleteVehicle(vehicle.id);
            setVehicles((current) => current.filter((item) => item.id !== vehicle.id));
            setNotice("Vehicle deleted successfully.");
        } catch (err) {
            setError(err.message || "Unable to delete vehicle.");
        } finally {
            setDeletingId(null);
        }
    }

    const filteredVehicles = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        if (!term) return vehicles;

        return vehicles.filter((vehicle) => {
            return [
                vehicle.name,
                vehicle.brand,
                vehicle.type,
                vehicle.category,
                vehicle.status,
            ].some((value) => String(value || "").toLowerCase().includes(term));
        });
    }, [searchTerm, vehicles]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Fleet Inventory
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Create, view, update, and remove vehicles from your rental fleet.
                    </p>
                </div>

                <Link
                    to="/vehicles/add"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Add Vehicle
                </Link>
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

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search vehicles..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm text-gray-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>

            {loading ? (
                <div className="rounded-xl border border-gray-200 bg-white p-8 text-gray-600 shadow-sm">
                    Loading vehicles...
                </div>
            ) : filteredVehicles.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Car size={24} />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-gray-900">
                        No vehicles found
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        {searchTerm ? "Try a different search term." : "Add your first vehicle to start managing inventory."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {filteredVehicles.map((vehicle) => (
                        <article
                            key={vehicle.id}
                            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                        >
                            <div className="aspect-[16/10] bg-gray-100">
                                <img
                                    src={vehicle.image || fallbackImage}
                                    alt={vehicle.name}
                                    className="h-full w-full object-cover"
                                    onError={(event) => {
                                        event.currentTarget.src = fallbackImage;
                                    }}
                                />
                            </div>

                            <div className="p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {vehicle.name}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {vehicle.brand} {vehicle.category ? `- ${vehicle.category}` : ""}
                                        </p>
                                    </div>
                                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(vehicle.status)}`}>
                                        {vehicle.status || "UNKNOWN"}
                                    </span>
                                </div>

                                <div className="mt-5 grid grid-cols-3 gap-3 rounded-lg bg-gray-50 p-3 text-sm">
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-gray-500">Type</p>
                                        <p className="font-medium text-gray-900">{vehicle.type || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-gray-500">Seats</p>
                                        <p className="font-medium text-gray-900">{vehicle.seats || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-gray-500">Price</p>
                                        <p className="font-medium text-gray-900">NPR {vehicle.price || 0}</p>
                                    </div>
                                </div>

                                <div className="mt-5 flex gap-3">
                                    <Link
                                        to={`/vehicles/edit/${vehicle.id}`}
                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(vehicle)}
                                        disabled={deletingId === vehicle.id}
                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Trash2 size={16} />
                                        {deletingId === vehicle.id ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Inventory;