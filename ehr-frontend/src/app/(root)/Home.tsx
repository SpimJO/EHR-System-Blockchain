import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ShieldCheckIcon,
  LockIcon,
  UsersIcon,
  FileTextIcon,
  ArrowRightIcon,
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ehr-blue-600 to-ehr-blue-800">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/30 -z-10" />

      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">EHR System</span>
          </div>
          <div className="flex gap-3">
            <Link to="/auth/login">
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Login
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button className="bg-white text-ehr-blue-600 hover:bg-white/90">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <ShieldCheckIcon className="w-20 h-20 mx-auto mb-6 text-white" />
          <h1 className="text-5xl font-bold text-white mb-6">
            Blockchain Based with AES-encryption
            <br />
            for Decentralized EHR System
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Secure, transparent, and patient-controlled healthcare records on the blockchain.
            Take control of your medical data with state-of-the-art encryption and decentralized storage.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/auth/register">
              <Button size="lg" className="bg-white text-ehr-blue-600 hover:bg-white/90">
                Get Started
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Login to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm border-none">
            <CardHeader>
              <LockIcon className="w-10 h-10 text-ehr-blue-600 mb-3" />
              <CardTitle>AES-128 Encryption</CardTitle>
              <CardDescription>
                All medical records are encrypted with military-grade AES-128 encryption before storage.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-none">
            <CardHeader>
              <ShieldCheckIcon className="w-10 h-10 text-ehr-blue-600 mb-3" />
              <CardTitle>Blockchain Verified</CardTitle>
              <CardDescription>
                Every access and modification is recorded on the blockchain for complete transparency and immutability.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-none">
            <CardHeader>
              <UsersIcon className="w-10 h-10 text-ehr-blue-600 mb-3" />
              <CardTitle>Patient Controlled</CardTitle>
              <CardDescription>
                You decide who can access your medical records and for how long. Full control over your data.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* User Types */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Choose Your Role</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/95 backdrop-blur-sm border-none hover:shadow-xl transition-shadow">
              <CardHeader>
                <UsersIcon className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle className="text-green-600">Patient</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Upload medical records</li>
                  <li>✓ Manage access permissions</li>
                  <li>✓ View audit logs</li>
                  <li>✓ Share records securely</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-none hover:shadow-xl transition-shadow">
              <CardHeader>
                <FileTextIcon className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle className="text-blue-600">Doctor</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Request patient access</li>
                  <li>✓ View authorized records</li>
                  <li>✓ Manage patient list</li>
                  <li>✓ Track access history</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-none hover:shadow-xl transition-shadow">
              <CardHeader>
                <ShieldCheckIcon className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle className="text-purple-600">Staff</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Request patient access</li>
                  <li>✓ View authorized records</li>
                  <li>✓ Support patient care</li>
                  <li>✓ Maintain records</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-white/70">
        <p>© 2026 EHR Blockchain System. Built with security and privacy in mind.</p>
      </footer>
    </div>
  );
};

export default Home;
