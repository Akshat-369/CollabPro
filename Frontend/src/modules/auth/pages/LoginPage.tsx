import React from 'react';
import { Anchor, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { AuthPageProps } from '../types/auth.types';

const LoginPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  return (
    <div className="fixed inset-0 w-full h-full flex bg-mine-shaft-950 text-mine-shaft-50 font-sans overflow-hidden transition-colors duration-300">
      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.5s ease-out forwards;
        }
      `}</style>
      
      <div className="w-full h-full flex animate-slide-in-left">
        <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-12 lg:p-20 relative z-10">
          <div className="absolute top-8 left-8 md:left-12">
            <Link to="/">
              <button className="flex items-center gap-2 px-4 py-2 bg-mine-shaft-900 border border-mine-shaft-700 rounded-lg text-bright-sun-400 hover:bg-mine-shaft-800 transition-colors text-sm font-medium">
                <ArrowLeft size={16} />
                Home
              </button>
            </Link>
          </div>

          <div className="flex-grow flex flex-col justify-center max-w-md mx-auto w-full mt-16 lg:mt-0">
            <h1 className="text-4xl font-bold text-mine-shaft-50 mb-10">Login</h1>
            <LoginForm onLogin={onLogin} />
            
            <div className="mt-4 text-center space-y-4">
              <p className="text-mine-shaft-300">
                Don't have an account?
                <Link to="/signup" className="text-bright-sun-400 hover:underline font-medium">SignUp</Link>
              </p>
              <Link to="/forgot-password" className="text-bright-sun-400 hover:underline text-sm font-medium">
                Forget Password?
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex w-1/2 relative items-center justify-center">
          <div className="absolute inset-0 bg-mine-shaft-800 rounded-l-[150px] border-l border-mine-shaft-700/50 ml-10 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-mine-shaft-900 rounded-full opacity-50 blur-3xl"></div>
          </div>

          <div className="relative z-10 text-center">
             <div className="flex items-center justify-center gap-4 mb-6">
                <Anchor size={64} className="text-bright-sun-400" />
                <h2 className="text-6xl font-bold text-bright-sun-400">CollabPro</h2>
             </div>
             <p className="text-2xl text-mine-shaft-200 font-medium">
               Find the project made for you
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;