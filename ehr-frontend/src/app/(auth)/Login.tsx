import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import Cookies from 'js-cookie';
import { authService } from '@/services/api/auth.service';
import { setSession } from '@/lib/ehr/session';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });

      if (response.data) {
        const { accessToken, user } = response.data;

        // Save token to cookie
        Cookies.set(import.meta.env.VITE_TOKEN_NAME || 'ehr_token', accessToken, {
          expires: rememberMe ? 7 : 1, // 7 days if remember me, else 1 day
          secure: true,
          sameSite: 'strict'
        });

        // Save user to local storage
        localStorage.setItem('ehr_user', JSON.stringify(user));

        // Set EHR session for middleware
        const userRole = user.role.toLowerCase() as 'patient' | 'doctor' | 'staff';
        setSession({
          isLoggedIn: true,
          userRole,
          userEmail: user.email,
          userName: user.fullName,
          authMethod: 'traditional',
          loginTimestamp: Date.now(),
          walletAddress: user.blockchainAddress,
        });

        setSuccess('Login successful! Redirecting...');

        // Redirect based on user role
        setTimeout(() => {
          const dashboardPath = `/dashboard/${userRole}`;
          navigate({ to: dashboardPath });
        }, 1000);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetaMaskLogin = () => {
    setError('MetaMask login will be implemented soon!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-background relative">
      {/* Background Image & Overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-20"
        style={{ backgroundImage: "url('/bg-image.png')" }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-primary/10 to-black/60 -z-10" />

      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden min-h-[600px] border border-white/20">
          {/* Left Side - Branding */}
          <div className="bg-gradient-to-br from-primary/90 to-primary/80 text-white p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden">
            {/* Abstract Background Pattern */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/10 rounded-full blur-3xl opacity-50"></div>

            <div className="relative z-10">
              <div className="mb-12">
                <ShieldCheckIcon className="w-16 h-16 mb-5 text-white" />
                <h1 className="text-4xl font-bold mb-4 leading-tight text-white drop-shadow-sm">
                  Blockchain Based with AES-encryption for Decentralized EHR System
                </h1>
                <p className="text-lg opacity-90 leading-relaxed text-white/90">
                  Your health records, secured and decentralized
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors">
                  <LockIcon className="w-6 h-6 text-white" />
                  <span className="font-medium text-white">Encrypted Records</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors">
                  <ShieldCheckIcon className="w-6 h-6 text-white" />
                  <span className="font-medium text-white">Immutable Records</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors">
                  <UserIcon className="w-6 h-6 text-white" />
                  <span className="font-medium text-white">You Control Access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="p-12 lg:p-16 flex items-center justify-center bg-white">
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
                <Alert className="mb-4 border-green-500 text-green-700 bg-green-50">
                  <CheckCircle2Icon className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-gray-700">
                    <MailIcon className="w-4 h-4 text-primary" />
                    Email / Username
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-50 border-gray-200 h-11 focus:border-primary focus:ring-primary"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2 text-gray-700">
                    <LockIcon className="w-4 h-4 text-primary" />
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
                      className="bg-gray-50 border-gray-200 h-11 pr-12 focus:border-primary focus:ring-primary"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-gray-500 hover:text-primary transition-colors"
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
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label
                      htmlFor="rememberMe"
                      className="text-sm font-normal cursor-pointer text-gray-600 hover:text-gray-900"
                    >
                      Remember me
                    </Label>
                  </div>
                  <a
                    href="#"
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Forgot Password?
                  </a>
                </div>

                {/* Submit Button */}
                <Button type="submit" disabled={isLoading} className="w-full h-11 text-base bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                  {isLoading ? 'Logging in...' : (
                    <>
                      <MailIcon className="w-4 h-4 mr-2" />
                      Login
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
                </div>
              </div>

              {/* MetaMask Login */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-medium"
                onClick={handleMetaMaskLogin}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                  alt="MetaMask"
                  className="w-5 h-5 mr-3"
                />
                Login with MetaMask
              </Button>

              {/* Register Link */}
              <p className="mt-8 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/auth/register"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
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
