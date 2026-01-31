import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getSession } from '@/lib/ehr/session';
import { Loader2Icon, ShieldCheckIcon } from 'lucide-react';

/**
 * Dashboard index - Redirects to the appropriate dashboard based on user role
 * from the session token. No more manual role selection.
 */
const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const session = getSession();
    
    if (!session || !session.isLoggedIn) {
      // No session, redirect to login
      navigate({ to: '/auth/login' });
      return;
    }

    // Redirect based on role from session
    const role = session.userRole;
    switch (role) {
      case 'patient':
        navigate({ to: '/dashboard/patient' });
        break;
      case 'doctor':
        navigate({ to: '/dashboard/doctor' });
        break;
      case 'staff':
        navigate({ to: '/dashboard/staff' });
        break;
      default:
        // Fallback to login if role is invalid
        navigate({ to: '/auth/login' });
    }
  }, [navigate]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <div className="relative p-4 bg-primary rounded-2xl shadow-lg shadow-primary/30">
            <ShieldCheckIcon className="w-12 h-12 text-white" />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <Loader2Icon className="w-5 h-5 animate-spin text-primary" />
          <span className="text-lg font-medium text-muted-foreground">
            Loading your dashboard...
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
