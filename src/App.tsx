import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './layouts/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Farmer Pages
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { FarmsPage } from './pages/farmer/FarmsPage';
import { FarmDetailPage } from './pages/farmer/FarmDetailPage';
import { WeatherPage } from './pages/farmer/WeatherPage';
import { MarketPricesPage } from './pages/farmer/MarketPricesPage';
import { CropRecommendationPage } from './pages/farmer/CropRecommendationPage';
import { AskExpertPage } from './pages/farmer/AskExpertPage';
import { QueryDetailPage } from './pages/farmer/QueryDetailPage';
import { NotificationsPage } from './pages/farmer/NotificationsPage';
import { ProfilePage } from './pages/farmer/ProfilePage';

// Expert Pages
import { ExpertDashboard } from './pages/expert/ExpertDashboard';
import { ExpertQueriesPage } from './pages/expert/ExpertQueriesPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminCropsPage } from './pages/admin/AdminCropsPage';
import { AdminQueriesPage } from './pages/admin/AdminQueriesPage';

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Marketing & Auth Layout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Authenticated Dashboard Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Farmer Routes */}
              <Route path="/dashboard" element={<FarmerDashboard />} />
              <Route path="/farms" element={<FarmsPage />} />
              <Route path="/farms/:farmId" element={<FarmDetailPage />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/market" element={<MarketPricesPage />} />
              <Route path="/crops/recommend" element={<CropRecommendationPage />} />
              <Route path="/queries" element={<AskExpertPage />} />
              <Route path="/queries/:queryId" element={<QueryDetailPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Expert Routes */}
              <Route
                path="/expert"
                element={
                  <ProtectedRoute allowedRoles={['expert', 'admin']}>
                    <ExpertDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/expert/queries"
                element={
                  <ProtectedRoute allowedRoles={['expert', 'admin']}>
                    <ExpertQueriesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/expert/queries/:queryId"
                element={
                  <ProtectedRoute allowedRoles={['expert', 'admin']}>
                    <QueryDetailPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/crops"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminCropsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/queries"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminQueriesPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}
