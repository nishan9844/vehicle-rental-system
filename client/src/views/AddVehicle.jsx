import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VehicleForm from "../components/vehicles/VehicleForm";
import { emptyVehicleForm } from "../components/vehicles/vehicleDefaults";
import { createVehicle } from "../services/vehicleService";

const AddVehicle = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(emptyVehicleForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

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
            await createVehicle(formData);
            navigate("/vehicles", {
                state: { message: "Vehicle added successfully." },
            });
        } catch (err) {
            setError(err.message || "Unable to add vehicle.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <VehicleForm
            title="Add Vehicle"
            submitLabel="Save Vehicle"
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            saving={saving}
            error={error}
        />
    );
};

export default AddVehicle;