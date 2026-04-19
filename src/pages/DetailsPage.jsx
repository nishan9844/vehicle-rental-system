import "../css/global.css";
import "../css/components.css";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { DetailsHero, DetailsContent } from "../components/DetailsPageComponents";
import { supabase } from "../supabaseClient";
import "../css/details.css";

export default function DetailsPage() {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchVehicle = async () => {
            const { data, error } = await supabase
                .from('vehicles')
                .select('*')
                .eq('id', id)
                .single();

            if (!error && data) {
                setVehicle(data);
            }
            setLoading(false);
        };

        fetchVehicle();
    }, [id]);

    if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>Loading details...</div>;
    if (!vehicle && id) return <div style={{ padding: "100px", textAlign: "center" }}>Vehicle not found.</div>;

    return (
        <>
            <Navbar />
            <div className="container">
                {/* Fallback to default render if no ID is provided, or pass vehicle data */}
                <DetailsHero vehicle={vehicle} />
                <DetailsContent vehicle={vehicle} />
            </div>
            <Footer />
        </>
    );
}
