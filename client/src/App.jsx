import React from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthProvider, useAuth } from './contexts/AuthContext';

import Layout from './components/Layout';

import Dashboard from './views/Dashboard';
import AddVehicle from './views/AddVehicle';
import Inventory from './views/Inventory';
import EditVehicle from './views/EditVehicle';

import Bookings from './views/Bookings';
import Customers from './views/Customers';
import Payments from './views/Payments';
import NewRental from './views/NewRental';

import Login from './views/Login';



// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-white">
          Loading...
        </div>
      </div>
    );
  }

  return isAuthenticated
    ? children
    : <Navigate to="/login" />;
};


// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-white">
          Loading...
        </div>
      </div>
    );
  }

  return !isAuthenticated
    ? children
    : <Navigate to="/" />;
};


// Logout Component
const LogoutPage = () => {
  const { logout } = useAuth();
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    logout().finally(() => setDone(true));
  }, [logout]);

  if (done) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
      <div className="text-white">
        Logging out...
      </div>
    </div>
  );
};



function AppRoutes() {
  return (
    <Routes>

      {/* PUBLIC ROUTE */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />



      {/* PROTECTED ROUTES */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >

        {/* DASHBOARD */}
        <Route
          index
          element={<Dashboard />}
        />



        {/* VEHICLE ROUTES */}
        <Route
          path="vehicles"
          element={<Inventory />}
        />

        <Route
          path="vehicles/add"
          element={<AddVehicle />}
        />

        {/* ADD THIS */}
        <Route
          path="vehicles/edit/:id"
          element={<EditVehicle />}
        />



        {/* OTHER ROUTES */}
        <Route
          path="bookings"
          element={<Bookings />}
        />

        <Route
          path="customers"
          element={<Customers />}
        />

        <Route
          path="payments"
          element={<Payments />}
        />

        <Route
          path="rentals/new"
          element={<NewRental />}
        />

      </Route>



      {/* LOGOUT */}
      <Route
        path="/logout"
        element={<LogoutPage />}
      />



      {/* FALLBACK */}
      <Route
        path="*"
        element={<Navigate to="/" />}
      />
    </Routes>
  );
}



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;