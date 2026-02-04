import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../shared/ui/Button';
import { AuthPageProps } from '../types/auth.types';
import { useUser } from '../../../../context/UserContext';

import AuthService from '../service/auth.service';

const LoginForm: React.FC<AuthPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const { refreshUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (email && password) {
      try {
        const normalizedEmail = email.trim().toLowerCase();
        await AuthService.login({ email: normalizedEmail, password });
        await refreshUser();
        onLogin();
        navigate('/browse');
      } catch (err: any) {
        setError(err.message || 'Login failed');
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      
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
              Continue with Google
          </button>
          
          <div className="relative flex items-center justify-center py-2">
              <div className="absolute w-full border-t border-mine-shaft-800"></div>
              <span className="relative px-3 bg-mine-shaft-950 text-mine-shaft-500 text-xs font-bold tracking-widest">OR</span>
          </div>
      </div>

      {error && <div className="text-red-500 text-sm font-medium text-center">{error}</div>}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-mine-shaft-100">
          Email <span className="text-red-500">*</span>
        </label>
        <input 
          type="email" 
          value={email}
          onChange={handleEmailChange}
          placeholder="Your email"
          className="w-full h-12 px-4 bg-mine-shaft-900 border border-mine-shaft-700 rounded-lg text-mine-shaft-50 placeholder-mine-shaft-500 focus:outline-none focus:border-bright-sun-400 focus:ring-1 focus:ring-bright-sun-400 transition-all"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-mine-shaft-100">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"} 
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
            className="w-full h-12 px-4 bg-mine-shaft-900 border border-mine-shaft-700 rounded-lg text-mine-shaft-50 placeholder-mine-shaft-500 focus:outline-none focus:border-bright-sun-400 focus:ring-1 focus:ring-bright-sun-400 transition-all pr-12"
            required
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-mine-shaft-400 hover:text-mine-shaft-50 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full font-bold text-lg h-12 bg-bright-sun-400 text-black hover:bg-bright-sun-500"
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;