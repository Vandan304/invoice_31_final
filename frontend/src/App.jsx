import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Spinner from './components/Spinner';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import OtpVerification from './pages/OtpVerification';
import Invoices from './pages/Invoices';
import CreateInvoice from './pages/CreateInvoice';
import Customers from './pages/Customers';
import Products from './pages/Products';
import BusinessProfile from './pages/BusinessProfile';
import Pricing from './pages/Pricing'; // Added

import LandingPage from './pages/LandingPage';

// Layout
import MainLayout from './layouts/MainLayout';

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <Spinner className="min-h-screen" />;
  if (!token) return <Navigate to="/sign-in" replace />;
  return <MainLayout>{children}</MainLayout>;
}

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* Public Routes */}
      {/* Public Routes */}
      <Route path="/sign-in" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<OtpVerification />} />

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
    <Toaster position="top-right" />
    </>
  );
}

export default App;
