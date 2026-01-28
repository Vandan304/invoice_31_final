import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Invoices from './pages/Invoices';
import CreateInvoice from './pages/CreateInvoice';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Settings from './pages/Settings';
import BusinessProfile from './pages/BusinessProfile';
import Pricing from './pages/Pricing'; // Added

import LandingPage from './pages/LandingPage';

// Layout
import MainLayout from './layouts/MainLayout';

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/sign-in" replace />;
  return <MainLayout>{children}</MainLayout>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* Public Routes */}
      <Route path="/sign-in" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/invoices"
        element={
          <ProtectedRoute>
            <Invoices />
          </ProtectedRoute>
        }
      />

      <Route
        path="/invoices/create"
        element={
          <ProtectedRoute>
            <CreateInvoice />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <BusinessProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pricing"
        element={
          <ProtectedRoute>
            <Pricing />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  );
}

export default App;
