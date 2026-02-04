import React from 'react';
import { Anchor, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SignUpForm from '../components/SignUpForm';
import { AuthPageProps } from '../types/auth.types';

const SignUpPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  return (
    <div className="h-screen flex bg-mine-shaft-950 text-mine-shaft-50 font-sans overflow-hidden transition-colors duration-300">
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.5s ease-out forwards;
        }
      `}</style>

      <div className="w-full h-full flex animate-slide-in-right">
        <div className="hidden lg:flex w-1/2 h-full relative items-center justify-center">
            <div className="absolute inset-0 bg-mine-shaft-800 rounded-r-[150px] border-r border-mine-shaft-700/50 mr-10 overflow-hidden">
                <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-mine-shaft-900 rounded-full opacity-50 blur-3xl"></div>
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

        <div className="w-full lg:w-1/2 h-full flex flex-col p-8 md:p-12 relative z-10 overflow-y-auto">
          <div className="absolute top-8 right-8 md:right-12">
            <Link to="/">
              <button className="flex items-center gap-2 px-4 py-2 bg-mine-shaft-900 border border-mine-shaft-700 rounded-lg text-bright-sun-400 hover:bg-mine-shaft-800 transition-colors text-sm font-medium">
                <ArrowLeft size={16} />
                Home
              </button>
            </Link>
          </div>

          <div className="flex-grow flex flex-col justify-center max-w-md mx-auto w-full">
            <h1 className="text-4xl font-bold text-mine-shaft-50 mb-8">Create Account</h1>
            <SignUpForm onLogin={onLogin} />
            <div className="mt-6 text-center">
              <p className="text-mine-shaft-300">
                Have an account?
                <Link to="/login" className="text-bright-sun-400 hover:underline font-medium">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;