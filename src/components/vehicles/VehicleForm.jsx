import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

const statusOptions = ["AVAILABLE", "RENTED", "MAINTENANCE"];
const vehicleTypeOptions = ["4 Wheeler", "2 Wheeler", "EV"];
const fuelOptions = ["Petrol", "Gasoline", "Diesel", "Electric", "Hybrid"];
const transmissionOptions = ["Automatic", "Manual"];

function VehicleForm({ title, submitLabel, formData, onChange, onSubmit, saving = false, error = "" }) {
    const imagePreview = useMemo(() => {
        return formData.image_url?.trim()
            || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&h=600&fit=crop";
    }, [formData.image_url]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Link to="/vehicles" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900">
                        <ArrowLeft size={16} />
                        Back to inventory
                    </Link>
                    <h1 className="mt-3 text-3xl font-bold text-gray-900">{title}</h1>
                </div>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700">Vehicle Name</span>
                            <input type="text" name="name" value={formData.name} onChange={onChange} required
                                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700">Brand</span>
                            <input type="text" name="brand" value={formData.brand} onChange={onChange} required
                                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700">Vehicle Type</span>
                            <select name="vehicle_type" value={formData.vehicle_type} onChange={onChange} required
                                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                                <option value="">Select type</option>
                                {vehicleTypeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700">Fuel Type</span>
                            <select name="fuel_type" value={formData.fuel_type} onChange={onChange} required
                                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                                <option value="">Select fuel</option>
                                {fuelOptions.map((f) => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700">Transmission</span>
                            <select name="transmission" value={formData.transmission} onChange={onChange}
                                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                                {transmissionOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700">Seats</span>
                            <input type="number" name="seats" min="1" value={formData.seats} onChange={onChange} required
                                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700">Price Per Day (NPR)</span>
                            <input type="number" name="price_per_day" min="0" step="0.01" value={formData.price_per_day} onChange={onChange} required
                                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700">Status</span>
                            <select name="status" value={formData.status} onChange={onChange} required
                                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                                {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </label>

                        <label className="space-y-2 md:col-span-2">
                            <span className="text-sm font-medium text-gray-700">Image URL</span>
                            <input type="url" name="image_url" value={formData.image_url} onChange={onChange} required
                                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        </label>

                        <label className="space-y-2 md:col-span-2">
                            <span className="text-sm font-medium text-gray-700">Description</span>
                            <textarea name="description" value={formData.description} onChange={onChange} rows={3}
                                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        </label>

                        <label className="space-y-2 flex items-center gap-3">
                            <input type="checkbox" name="is_published" checked={formData.is_published} onChange={onChange}
                                className="w-4 h-4 accent-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Published (visible to users)</span>
                        </label>
                    </div>

                    <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6">
                        <Link to="/vehicles" className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Cancel
                        </Link>
                        <button type="submit" disabled={saving}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                            <Save size={16} />
                            {saving ? "Saving..." : submitLabel}
                        </button>
                    </div>
                </div>

                <aside className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm self-start">
                    <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                        <img src={imagePreview} alt={formData.name || "Vehicle preview"} className="h-full w-full object-cover"
                            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&h=600&fit=crop"; }} />
                    </div>
                    <div className="mt-4 space-y-1">
                        <p className="text-xs font-semibold uppercase text-gray-500">Preview</p>
                        <h2 className="text-xl font-bold text-gray-900">{formData.name || "Vehicle name"}</h2>
                        <p className="text-sm text-gray-600">{formData.brand || "Brand"} {formData.vehicle_type ? `- ${formData.vehicle_type}` : ""}</p>
                        <p className="text-sm font-semibold text-blue-600">NPR {formData.price_per_day || "0"} per day</p>
                    </div>
                </aside>
            </form>
        </div>
    );
}

export default VehicleForm;
