import { useEffect, useState } from "react";
import { getVehicles } from "../services/vehicleService";

export default function AdminPanel() {
    const [vehicles, setVehicles] = useState([]);

    const loadVehicles = async () => {
        const { data } = await getVehicles();
        if (data) setVehicles(data);
    };

    useEffect(() => {
        loadVehicles();
    }, []);

    return (
        <div style={{ padding: "40px" }}>
            <h1>Admin Panel</h1>
            <p>Manage vehicles from the dedicated admin panel.</p>
            <ul>
                {vehicles.map((v) => (
                    <li key={v.id}>{v.name}</li>
                ))}
            </ul>
        </div>
    );
}
