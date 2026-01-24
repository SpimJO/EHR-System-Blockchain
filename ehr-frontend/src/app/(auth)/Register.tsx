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
  PhoneIcon,
  UserPlusIcon,
  StethoscopeIcon,
  IdCardIcon,
  BuildingIcon,
  CalendarIcon,
  DropletIcon,
} from 'lucide-react';

type UserRole = '' | 'patient' | 'doctor' | 'staff';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Doctor fields
  const [specialty, setSpecialty] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  // Staff fields
  const [department, setDepartment] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  // Patient fields
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (!agreeToTerms) {
      setError('Please agree to the Terms and Conditions');
      return;
    }

    // Placeholder - functionality to be added later
    setSuccess('Registration functionality will be connected soon!');
  };

  const handleMetaMaskRegister = () => {
    setError('MetaMask registration will be implemented soon!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-background relative">
      {/* Background Image & Overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-20"
        style={{ backgroundImage: "url('/bg-image.png')" }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-amber-100/40 to-black/60 -z-10" />

      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 lg:p-12 border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <ShieldCheckIcon className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500">Join the EHR Blockchain System</p>
        </div>

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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role" className="flex items-center gap-2 text-gray-700">
              <UserIcon className="w-4 h-4 text-primary" />
              Register As
            </Label>
            <Select value={userRole} onValueChange={(value) => setUserRole(value as UserRole)}>
              <SelectTrigger className="bg-gray-50 border-gray-200 h-11 focus:ring-primary">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient">Patient</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2 text-gray-700">
              <UserIcon className="w-4 h-4 text-primary" />
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="bg-gray-50 border-gray-200 h-11 focus:border-primary focus:ring-primary"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-gray-700">
              <MailIcon className="w-4 h-4 text-primary" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="bg-gray-50 border-gray-200 h-11 pr-12 focus:border-primary focus:ring-primary"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-gray-500 hover:text-primary transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500">Minimum 8 characters</p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-gray-700">
              <LockIcon className="w-4 h-4 text-primary" />
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="bg-gray-50 border-gray-200 h-11 pr-12 focus:border-primary focus:ring-primary"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-gray-500 hover:text-primary transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="w-4 h-4" />
                ) : (
                  <EyeIcon className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Doctor-specific fields */}
          {userRole === 'doctor' && (
            <div className="space-y-5 p-6 bg-blue-50/50 border border-blue-100 rounded-xl">
              <div className="space-y-2">
                <Label htmlFor="specialty" className="flex items-center gap-2 text-blue-700">
                  <StethoscopeIcon className="w-4 h-4" />
                  Specialty
                </Label>
                <Select value={specialty} onValueChange={setSpecialty}>
                  <SelectTrigger className="bg-white border-blue-200 h-11 focus:ring-blue-500">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                    <SelectItem value="Neurologist">Neurologist</SelectItem>
                    <SelectItem value="General Physician">General Physician</SelectItem>
                    <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                    <SelectItem value="Surgeon">Surgeon</SelectItem>
                    <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber" className="flex items-center gap-2 text-blue-700">
                  <IdCardIcon className="w-4 h-4" />
                  Medical License Number
                </Label>
                <Input
                  id="licenseNumber"
                  type="text"
                  placeholder="Enter license number"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="bg-white border-blue-200 h-11 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Staff-specific fields */}
          {userRole === 'staff' && (
            <div className="space-y-5 p-6 bg-purple-50/50 border border-purple-100 rounded-xl">
              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2 text-purple-700">
                  <BuildingIcon className="w-4 h-4" />
                  Department
                </Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="bg-white border-purple-200 h-11 focus:ring-purple-500">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="Nursing">Nursing</SelectItem>
                    <SelectItem value="Laboratory">Laboratory</SelectItem>
                    <SelectItem value="Radiology">Radiology</SelectItem>
                    <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeId" className="flex items-center gap-2 text-purple-700">
                  <IdCardIcon className="w-4 h-4" />
                  Employee ID
                </Label>
                <Input
                  id="employeeId"
                  type="text"
                  placeholder="Enter employee ID"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="bg-white border-purple-200 h-11 focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* Patient-specific fields */}
          {userRole === 'patient' && (
            <div className="space-y-5 p-6 bg-green-50/50 border border-green-100 rounded-xl">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="flex items-center gap-2 text-green-700">
                  <CalendarIcon className="w-4 h-4" />
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="bg-white border-green-200 h-11 focus:border-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodGroup" className="flex items-center gap-2 text-green-700">
                  <DropletIcon className="w-4 h-4" />
                  Blood Group
                </Label>
                <Select value={bloodGroup} onValueChange={setBloodGroup}>
                  <SelectTrigger className="bg-white border-green-200 h-11 focus:ring-green-500">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-gray-700">
              <PhoneIcon className="w-4 h-4 text-primary" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="bg-gray-50 border-gray-200 h-11 focus:border-primary focus:ring-primary"
            />
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor="terms" className="text-sm font-normal cursor-pointer text-gray-600 hover:text-gray-900">
              I agree to the{' '}
              <a href="#" className="text-primary hover:text-amber-600 hover:underline">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:text-amber-600 hover:underline">
                Privacy Policy
              </a>
            </Label>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full h-11 text-base bg-primary hover:bg-amber-600 text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
            <UserPlusIcon className="w-4 h-4 mr-2" />
            Create Account
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

        {/* MetaMask Registration */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-medium"
          onClick={handleMetaMaskRegister}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
            alt="MetaMask"
            className="w-5 h-5 mr-3"
          />
          Register with MetaMask
        </Button>

        {/* Login Link */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="text-primary hover:text-amber-600 font-semibold transition-colors"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
