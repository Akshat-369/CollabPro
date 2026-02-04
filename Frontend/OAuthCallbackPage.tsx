import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from './context/UserContext';
import AuthService from './src/modules/auth/service/auth.service';

interface OAuthCallbackPageProps {
    onLogin: () => void;
}

const OAuthCallbackPage: React.FC<OAuthCallbackPageProps> = ({ onLogin }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { refreshUser } = useUser();
    
    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            // Update global auth state first to prevent redirect loops
            onLogin(); 
             
            // Refresh user and redirect
            refreshUser().then(() => {
                navigate('/browse', { replace: true });
            }).catch(() => {
                // Determine error handling, maybe logout if refresh fails?
                // For now, assume success or navigate login on strict fail
                 navigate('/browse', { replace: true }); 
                // Or: navigate('/login?error=oauth_failed');
            });
        } else {
            navigate('/login?error=no_token');
        }
    }, [searchParams, navigate, refreshUser, onLogin]);

    return (
        <div className="min-h-screen bg-mine-shaft-950 flex items-center justify-center text-white">
            <p>Authenticating...</p>
        </div>
    );
};

export default OAuthCallbackPage;
