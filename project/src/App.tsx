import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Layout } from './components/Layout';

import WelcomePage from './pages/WelcomePage';
import { LoginPage, SignupPage } from './pages/AuthPages';
import BuyerHomePage from './pages/HomePage';
import FarmerHomePage from './pages/FarmerHomePage';
import ScanPage from './pages/ScanPage';
import MarketplacePage from './pages/MarketplacePage';
import SellPage from './pages/SellPage';
import InsightsPage from './pages/InsightsPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import CropDetailPage from './pages/CropDetailPage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';

function HomePage() {
  const { profile } = useAuth();

  if (profile?.role === 'farmer') {
    return <FarmerHomePage />;
  }

  return <BuyerHomePage />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scan"
        element={
          <ProtectedRoute>
            <ScanPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/marketplace"
        element={
          <ProtectedRoute>
            <MarketplacePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/crop/:id"
        element={
          <ProtectedRoute>
            <CropDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sell"
        element={
          <ProtectedRoute>
            <SellPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/insights"
        element={
          <ProtectedRoute>
            <InsightsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/community"
        element={
          <ProtectedRoute>
            <CommunityPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Messages</h2>
                <p className="text-gray-600">Coming soon!</p>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <AppRoutes />
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
