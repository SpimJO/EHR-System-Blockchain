import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ShieldCheckIcon,
  UserIcon,
  StethoscopeIcon,
  UsersIcon,
  ArrowRightIcon,
  EyeIcon,
} from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ehr-blue-600 to-ehr-blue-800 p-8">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/30 -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <ShieldCheckIcon className="w-20 h-20 mx-auto mb-6 text-white animate-pulse" />
          <h1 className="text-4xl font-bold text-white mb-4">
            🎨 EHR System - UI Demo
          </h1>
          <p className="text-xl text-white/90 mb-2">
            Quick Access to All Dashboards (UI Preview Only)
          </p>
          <p className="text-sm text-white/70">
            No authentication required - Click any dashboard to explore!
          </p>
        </div>

        {/* Mock Credentials */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm border-2 border-yellow-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <EyeIcon className="w-5 h-5" />
              Test Credentials (UI Preview - Not Functional Yet)
            </CardTitle>
            <CardDescription>
              You can use these for form testing, but authentication is not connected yet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">👤 Patient</h3>
                <p className="text-sm text-green-700 mb-1">
                  <span className="font-medium">Email:</span> john.doe@patient.com
                </p>
                <p className="text-sm text-green-700">
                  <span className="font-medium">Password:</span> patient123
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">👨‍⚕️ Doctor</h3>
                <p className="text-sm text-blue-700 mb-1">
                  <span className="font-medium">Email:</span> sarah.johnson@doctor.com
                </p>
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Password:</span> doctor123
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">🏥 Staff</h3>
                <p className="text-sm text-purple-700 mb-1">
                  <span className="font-medium">Email:</span> emily.davis@staff.com
                </p>
                <p className="text-sm text-purple-700">
                  <span className="font-medium">Password:</span> staff123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Patient Dashboard */}
          <Link to="/dashboard/patient">
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/95 backdrop-blur-sm border-2 hover:border-green-400 cursor-pointer">
              <CardHeader>
                <div className="p-4 bg-green-100 rounded-xl w-fit mb-4 group-hover:bg-green-200 transition-colors">
                  <UserIcon className="w-10 h-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-600 group-hover:text-green-700">
                  Patient Dashboard
                </CardTitle>
                <CardDescription className="text-base">
                  View medical records, manage permissions, and upload files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li>✓ Dashboard with 4 stat cards</li>
                  <li>✓ Profile management</li>
                  <li>✓ Medical records grid</li>
                  <li>✓ Upload record form</li>
                  <li>✓ Access requests (with actions)</li>
                  <li>✓ Permissions list</li>
                  <li>✓ Audit log timeline</li>
                </ul>
                <Button className="w-full bg-green-600 hover:bg-green-700 group-hover:shadow-lg">
                  View Dashboard
                  <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Doctor Dashboard */}
          <Link to="/dashboard/doctor">
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/95 backdrop-blur-sm border-2 hover:border-blue-400 cursor-pointer">
              <CardHeader>
                <div className="p-4 bg-blue-100 rounded-xl w-fit mb-4 group-hover:bg-blue-200 transition-colors">
                  <StethoscopeIcon className="w-10 h-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-blue-600 group-hover:text-blue-700">
                  Doctor Dashboard
                </CardTitle>
                <CardDescription className="text-base">
                  Access patient records and manage consultations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li>✓ Dashboard with stats</li>
                  <li>✓ Doctor profile</li>
                  <li>✓ My patients list</li>
                  <li>✓ Request access form</li>
                  <li>✓ Patient records viewer</li>
                  <li>✓ Pending requests</li>
                  <li>✓ Recent activity</li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 group-hover:shadow-lg">
                  View Dashboard
                  <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Staff Dashboard */}
          <Link to="/dashboard/staff">
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/95 backdrop-blur-sm border-2 hover:border-purple-400 cursor-pointer">
              <CardHeader>
                <div className="p-4 bg-purple-100 rounded-xl w-fit mb-4 group-hover:bg-purple-200 transition-colors">
                  <UsersIcon className="w-10 h-10 text-purple-600" />
                </div>
                <CardTitle className="text-2xl text-purple-600 group-hover:text-purple-700">
                  Staff Dashboard
                </CardTitle>
                <CardDescription className="text-base">
                  Support patient care and manage records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li>✓ Dashboard with stats</li>
                  <li>✓ Staff profile</li>
                  <li>✓ My patients list</li>
                  <li>✓ Request access form</li>
                  <li>✓ Patient records viewer</li>
                  <li>✓ Pending requests</li>
                  <li>✓ Recent activity</li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 group-hover:shadow-lg">
                  View Dashboard
                  <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Auth Pages */}
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>🎨 Authentication Pages (UI Only)</CardTitle>
            <CardDescription>
              View the login and registration interfaces
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Link to="/auth/login" className="flex-1">
                <Button variant="outline" className="w-full h-auto py-4 hover:bg-ehr-blue-50">
                  <div className="text-left">
                    <p className="font-semibold text-base">Login Page</p>
                    <p className="text-xs text-gray-500">Two-column layout with MetaMask option</p>
                  </div>
                </Button>
              </Link>
              <Link to="/auth/register" className="flex-1">
                <Button variant="outline" className="w-full h-auto py-4 hover:bg-ehr-blue-50">
                  <div className="text-left">
                    <p className="font-semibold text-base">Register Page</p>
                    <p className="text-xs text-gray-500">Role-based registration form</p>
                  </div>
                </Button>
              </Link>
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full h-auto py-4 hover:bg-ehr-blue-50">
                  <div className="text-left">
                    <p className="font-semibold text-base">Landing Page</p>
                    <p className="text-xs text-gray-500">Hero section with features</p>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-8 text-center text-white/70 text-sm">
          <p className="mb-2">
            💡 <strong>Note:</strong> This is a UI preview only. Authentication and backend functionality
            are not connected yet.
          </p>
          <p>All dashboards show static mock data for demonstration purposes.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
