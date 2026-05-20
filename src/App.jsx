import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import Layout from "./components/Layout";

import Dashboard from "./views/Dashboard";
import Inventory from "./views/Inventory";
import AddVehicle from "./views/AddVehicle";
import EditVehicle from "./views/EditVehicle";
import Bookings from "./views/Bookings";
import Customers from "./views/Customers";
import Payments from "./views/Payments";
import Login from "./views/Login";
import NewRental from "./views/NewRental";

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/vehicles"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Inventory />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/inventory"
                element={<Navigate to="/vehicles" replace />}
            />

            <Route
                path="/vehicles/add"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <AddVehicle />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/vehicles/:id/edit"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <EditVehicle />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/bookings"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Bookings />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/customers"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Customers />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/payments"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Payments />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/rentals/new"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <NewRental />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
