import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../../../shared/ui/Button';
import AuthService from '../service/auth.service';

const VerifyOtpPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !email) return;

    setLoading(true);
    setError(null);
    try {
        await AuthService.verifyOtp(email, otp);
        navigate(`/reset-password`, { state: { email, otpVerified: true } });
    } catch (e: any) {
        setError(e.message || "Invalid or Expired OTP");
        alert("Invalid or Expired OTP"); // "Popup error" requested
    } finally {
        setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
        await AuthService.forgotPassword(email);
        alert("OTP Resent successfully");
    } catch (e) {
        alert("Failed to resend OTP");
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-mine-shaft-950 text-mine-shaft-50 font-sans p-4">
      <div className="w-full max-w-md bg-mine-shaft-900 border border-mine-shaft-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Verify OTP</h1>
            <p className="text-mine-shaft-400 text-sm">Enter the 6-digit OTP sent to {email}</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            
            <div className="space-y-2">
                <label className="block text-sm font-medium text-mine-shaft-100">One Time Password</label>
                <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtp(val);
                    }}
                    placeholder="123456"
                    className="w-full h-12 px-4 bg-mine-shaft-950 border border-mine-shaft-700 rounded-lg text-white tracking-widest text-center text-xl font-mono focus:border-bright-sun-400 focus:outline-none transition-colors"
                    required
                    maxLength={6}
                />
            </div>
            
            <Button 
                type="submit" 
                className="w-full h-12 bg-bright-sun-400 text-black font-bold text-lg hover:bg-bright-sun-500 rounded-lg transition-colors"
                disabled={loading || otp.length !== 6}
            >
                {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>
        </form>
        
        <div className="mt-6 text-center">
            <button onClick={handleResend} className="text-sm text-bright-sun-400 hover:underline bg-transparent border-none cursor-pointer">
                Resend OTP
            </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
