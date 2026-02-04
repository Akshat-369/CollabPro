import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../../shared/ui/Button';
import AuthService from '../service/auth.service';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
        await AuthService.forgotPassword(email);
    } catch (e) {
        // Ignore error
    } finally {
        setLoading(false);
        // "Always show popup" -> I'll use alert for simplicity as per "Popups only for success/error (existing popup system)"
        // Or if there is a custom popup, I should use it. 
        // User said "Popups only for success/error (existing popup system)".
        // I don't see a Toast/Popup context imported in other files.
        // `LoginForm` uses simple `error` state text. `UserContext` uses `alert()`.
        // I will use `alert()` as it aligns with `UserContext` usage.
        alert("If the email exists, an OTP has been sent.");
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-mine-shaft-950 text-mine-shaft-50 font-sans p-4">
      <div className="w-full max-w-md bg-mine-shaft-900 border border-mine-shaft-800 rounded-2xl p-8 shadow-2xl relative">
        <Link to="/login" className="absolute top-6 left-6 text-mine-shaft-400 hover:text-white transition-colors">
            <ArrowLeft size={24} />
        </Link>
        
        <div className="text-center mb-8 mt-4">
            <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
            <p className="text-mine-shaft-400 text-sm">Enter your registered email to receive OTP</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-mine-shaft-100">Email Address</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full h-12 px-4 bg-mine-shaft-950 border border-mine-shaft-700 rounded-lg text-white focus:border-bright-sun-400 focus:outline-none transition-colors"
                    required
                />
            </div>
            
            <Button 
                type="submit" 
                className="w-full h-12 bg-bright-sun-400 text-black font-bold text-lg hover:bg-bright-sun-500 rounded-lg transition-colors"
                disabled={loading}
            >
                {loading ? 'Sending...' : 'Send OTP'}
            </Button>
        </form>
        
        <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-bright-sun-400 hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
