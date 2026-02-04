import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../../shared/ui/Button';
import AuthService from '../service/auth.service';

const ResetPasswordPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { email: string; otpVerified: boolean } | null;
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!state?.email || !state?.otpVerified) {
        navigate('/login', { replace: true });
    }
  }, [state, navigate]);

  if (!state?.email || !state?.otpVerified) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }
    if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
    }

    setLoading(true);
    try {
        await AuthService.resetPassword(state.email, password);
        alert("Password updated successfully");
        navigate('/login');
    } catch (e: any) {
        setError(e.message || "Failed to update password");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-mine-shaft-950 text-mine-shaft-50 font-sans p-4">
      <div className="w-full max-w-md bg-mine-shaft-900 border border-mine-shaft-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
            <p className="text-mine-shaft-400 text-sm">Create a new secure password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            
            <div className="space-y-2">
                <label className="block text-sm font-medium text-mine-shaft-100">New Password</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full h-12 px-4 bg-mine-shaft-950 border border-mine-shaft-700 rounded-lg text-white focus:border-bright-sun-400 focus:outline-none transition-colors"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-mine-shaft-100">Confirm Password</label>
                <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full h-12 px-4 bg-mine-shaft-950 border border-mine-shaft-700 rounded-lg text-white focus:border-bright-sun-400 focus:outline-none transition-colors"
                    required
                />
            </div>
            
            <Button 
                type="submit" 
                className="w-full h-12 bg-bright-sun-400 text-black font-bold text-lg hover:bg-bright-sun-500 rounded-lg transition-colors"
                disabled={loading}
            >
                {loading ? 'Updating...' : 'Update Password'}
            </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
