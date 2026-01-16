import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ShieldCheckIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder - functionality to be added later
    setSuccess('Login functionality will be connected soon!');
  };

  const handleMetaMaskLogin = () => {
    setError('MetaMask login will be implemented soon!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-ehr-blue-600 to-ehr-blue-800">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/30 -z-10" />

      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[600px]">
          {/* Left Side - Branding */}
          <div className="bg-gradient-to-br from-teal-700 to-teal-900 text-white p-12 lg:p-16 flex flex-col justify-center">
            <div className="mb-12">
              <ShieldCheckIcon className="w-16 h-16 mb-5 opacity-90" />
              <h1 className="text-4xl font-bold mb-4 leading-tight">
                Blockchain Based with AES-encryption for Decentralized EHR System
              </h1>
              <p className="text-lg opacity-90 leading-relaxed">
                Secure, transparent, and patient-controlled healthcare records on the blockchain
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <LockIcon className="w-6 h-6 opacity-90" />
                <span className="font-medium">AES-128 Encryption</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <ShieldCheckIcon className="w-6 h-6 opacity-90" />
                <span className="font-medium">Blockchain Verified</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <UserIcon className="w-6 h-6 opacity-90" />
                <span className="font-medium">Patient Controlled</span>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="p-12 lg:p-16 flex items-center justify-center">
            <div className="w-full max-w-md">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome Back</h2>
              <p className="text-gray-500 mb-8">Please login to your account</p>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircleIcon className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Message */}
              {success && (
                <Alert className="mb-4 border-green-500 text-green-700">
                  <CheckCircle2Icon className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* User Role */}
                <div className="space-y-2">
                  <Label htmlFor="userRole" className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    User Role
                  </Label>
                  <Select value={userRole} onValueChange={setUserRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <MailIcon className="w-4 h-4" />
                    Email / Username
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <LockIcon className="w-4 h-4" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="w-4 h-4" />
                      ) : (
                        <EyeIcon className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label
                      htmlFor="rememberMe"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Link
                    href="#"
                    className="text-sm text-ehr-blue-600 hover:text-ehr-blue-700 font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full bg-ehr-blue-600 hover:bg-ehr-blue-700">
                  <MailIcon className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* MetaMask Login */}
              <Button
                type="button"
                variant="outline"
                className="w-full border-2"
                onClick={handleMetaMaskLogin}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                  alt="MetaMask"
                  className="w-5 h-5 mr-2"
                />
                Login with MetaMask
              </Button>

              {/* Register Link */}
              <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/auth/register"
                  className="text-ehr-blue-600 hover:text-ehr-blue-700 font-medium"
                >
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
