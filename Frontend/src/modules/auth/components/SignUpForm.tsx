import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../shared/ui/Button';
import { AuthPageProps } from '../types/auth.types';
import { useUser } from '../../../../context/UserContext';
import AuthService from '../service/auth.service';

const SignUpForm: React.FC<AuthPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const { refreshUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Name Validation
    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required";
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm Password Validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear specific field error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (globalError) setGlobalError(null);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    if (!validateForm()) {
      return;
    }

    try {
      const normalizedEmail = formData.email.trim().toLowerCase();
      await AuthService.register({
          name: formData.name,
          email: normalizedEmail,
          password: formData.password
      });
      await refreshUser();
      onLogin();
      navigate('/browse');
    } catch (err: any) {
      setGlobalError(err.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-5">
      
      {/* Google Login Section */}
      <div className="flex flex-col gap-4">
          <button 
            type="button" 
            onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
            className="w-full h-12 flex items-center justify-center gap-3 bg-mine-shaft-800 border border-mine-shaft-700 hover:bg-mine-shaft-700 hover:border-mine-shaft-600 text-white rounded-lg transition-all font-bold text-sm md:text-base group"
          >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign up with Google
          </button>
          
          <div className="relative flex items-center justify-center py-2">
              <div className="absolute w-full border-t border-mine-shaft-800"></div>
              <span className="relative px-3 bg-mine-shaft-950 text-mine-shaft-500 text-xs font-bold tracking-widest">OR</span>
          </div>
      </div>

      {globalError && <div className="text-red-500 text-sm font-medium">{globalError}</div>}
      
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-mine-shaft-100">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Marshal"
          className={`w-full h-11 px-4 bg-mine-shaft-900 border ${errors.name ? 'border-red-500' : 'border-mine-shaft-700'} rounded-lg text-mine-shaft-50 placeholder-mine-shaft-500 focus:outline-none focus:border-bright-sun-400 focus:ring-1 focus:ring-bright-sun-400 transition-all`}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-mine-shaft-100">
          Email <span className="text-red-500">*</span>
        </label>
        <input 
          type="email" 
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="email@example.com"
          className={`w-full h-11 px-4 bg-mine-shaft-900 border ${errors.email ? 'border-red-500' : 'border-mine-shaft-700'} rounded-lg text-mine-shaft-50 placeholder-mine-shaft-500 focus:outline-none focus:border-bright-sun-400 focus:ring-1 focus:ring-bright-sun-400 transition-all`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-mine-shaft-100">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"} 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className={`w-full h-11 px-4 bg-mine-shaft-900 border ${errors.password ? 'border-red-500' : 'border-mine-shaft-700'} rounded-lg text-mine-shaft-50 placeholder-mine-shaft-500 focus:outline-none focus:border-bright-sun-400 focus:ring-1 focus:ring-bright-sun-400 transition-all pr-12`}
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-mine-shaft-400 hover:text-mine-shaft-50 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-mine-shaft-100">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input 
            type={showConfirmPassword ? "text" : "password"} 
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className={`w-full h-11 px-4 bg-mine-shaft-900 border ${errors.confirmPassword ? 'border-red-500' : 'border-mine-shaft-700'} rounded-lg text-mine-shaft-50 placeholder-mine-shaft-500 focus:outline-none focus:border-bright-sun-400 focus:ring-1 focus:ring-bright-sun-400 transition-all pr-12`}
          />
          <button 
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-mine-shaft-400 hover:text-mine-shaft-50 transition-colors"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
      </div>

      <Button 
        type="submit" 
        className="w-full font-bold text-lg h-12 bg-bright-sun-400 text-black hover:bg-bright-sun-500 mt-2"
      >
        Sign up
      </Button>
    </form>
  );
};

export default SignUpForm;