import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VehicleForm from "../components/vehicles/VehicleForm";
import { emptyVehicleForm } from "../components/vehicles/vehicleDefaults";
import { getVehicleById, updateVehicle } from "../services/vehicleService";

function mapVehicleToForm(vehicle) {
    return {
        name: vehicle?.name ?? "",
        brand: vehicle?.brand ?? "",
        type: vehicle?.type ?? "",
        category: vehicle?.category ?? "",
        seats: vehicle?.seats ?? "",
        price: vehicle?.price ?? "",
        status: vehicle?.status ?? "AVAILABLE",
        image: vehicle?.image ?? "",
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
        setFormData((current) => ({
            ...current,
            [event.target.name]: event.target.value,
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