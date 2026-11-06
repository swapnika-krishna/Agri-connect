import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../components/common/Button';

export interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if expert account is pending admin approval
  if (user.role === 'expert' && user.isApproved === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 p-6 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Expert Account Pending Approval</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Your registration as an agricultural specialist is awaiting review and verification by the
            platform administrator. You will be able to answer farmer queries once approved.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.location.href = '/login';
              }}
            >
              Sign In with Another Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect to their appropriate dashboard if unauthorized for this specific route
    const fallbackPath = role === 'admin' ? '/admin' : role === 'expert' ? '/expert' : '/dashboard';
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};
