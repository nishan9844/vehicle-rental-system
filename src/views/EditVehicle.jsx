import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VehicleForm from "../components/vehicles/VehicleForm";
import { emptyVehicleForm } from "../components/vehicles/vehicleDefaults";
import { getVehicleById, updateVehicle } from "../services/vehicleService";

function mapVehicleToForm(vehicle) {
    return {
        name: vehicle?.name ?? "",
        brand: vehicle?.brand ?? "",
        vehicle_type: vehicle?.vehicle_type ?? vehicle?.category ?? "4 Wheeler",
        fuel_type: vehicle?.fuel_type ?? vehicle?.type ?? "Petrol",
        category: vehicle?.vehicle_type ?? vehicle?.category ?? "4 Wheeler",
        transmission: vehicle?.transmission ?? "Automatic",
        seats: vehicle?.seats ?? "",
        price_per_day: vehicle?.price_per_day ?? vehicle?.price ?? "",
        status: vehicle?.status ?? "AVAILABLE",
        image_url: vehicle?.image_url ?? vehicle?.image ?? "",
        description: vehicle?.description ?? "",
        is_published: vehicle?.is_published !== false,
    };
}

const EditVehicle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(emptyVehicleForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function fetchVehicle() {
            setLoading(true);
            setError("");

            try {
                const data = await getVehicleById(id);
                if (active) {
                    setFormData(mapVehicleToForm(data));
                }
            } catch (err) {
                if (active) {
                    setError(err.message || "Unable to load vehicle.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        fetchVehicle();

        return () => {
            active = false;
        };
    }, [id]);

    function handleChange(event) {
        const { name, value, type, checked } = event.target;
        setFormData((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value,
            ...(name === "vehicle_type" ? { category: value } : {}),
        }));
        setError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSaving(true);
        setError("");

        try {
            await updateVehicle(id, formData);
            navigate("/vehicles", {
                state: { message: "Vehicle updated successfully." },
            });
        } catch (err) {
            setError(err.message || "Unable to update vehicle.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-gray-600 shadow-sm">
                Loading vehicle...
            </div>
        );
    }

    return (
        <VehicleForm
            title="Edit Vehicle"
            submitLabel="Update Vehicle"
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            saving={saving}
            error={error}
        />
    );
};

export default EditVehicle;