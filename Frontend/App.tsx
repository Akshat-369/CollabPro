import React, { useState, useEffect } from 'react';
import AuthService from './src/modules/auth/service/auth.service';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { ProjectProvider } from './context/ProjectContext';
import LandingPage from './src/modules/landing/LandingPage';
import LoginPage from './src/modules/auth/pages/LoginPage';
import SignUpPage from './src/modules/auth/pages/SignUpPage';
import ForgotPasswordPage from './src/modules/auth/pages/ForgotPasswordPage';
import VerifyOtpPage from './src/modules/auth/pages/VerifyOtpPage';
import ResetPasswordPage from './src/modules/auth/pages/ResetPasswordPage';
import Navbar from './src/modules/layout/Navbar';
import BrowsePage from './src/modules/browse/pages/BrowsePage';
import ProjectDetailsPage from './src/modules/projects/pages/ProjectDetailsPage';
import ApplyPage from './src/modules/projects/pages/ApplyPage';
import ManageProjectsPage from './src/modules/projects/pages/ManageProjectsPage';
import ProjectDashboardPage from './src/modules/projects/pages/ProjectDashboardPage';
import CreateProjectPage from './src/modules/projects/pages/CreateProjectPage';
import ProfilePage from './src/modules/profile/pages/ProfilePage';
import CandidateProfilePage from './src/modules/candidates/pages/CandidateProfilePage';


import OAuthCallbackPage from './OAuthCallbackPage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(AuthService.isAuthenticated());

  useEffect(() => {
    if (isLoggedIn) {
      AuthService.getCurrentUser().catch(() => {
        AuthService.logout();
        setIsLoggedIn(false);
      });
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
  };

  return (
    <ThemeProvider>
      <UserProvider>
        <ProjectProvider>
          <Router>
            <Routes>
              <Route path="/oauth2/success" element={<OAuthCallbackPage onLogin={() => setIsLoggedIn(true)} />} />
              <Route path="/" element={!isLoggedIn ? <LandingPage isLoggedIn={false} /> : <Navigate to="/browse" replace />} />
              <Route path="/login" element={!isLoggedIn ? <LoginPage onLogin={() => setIsLoggedIn(true)} /> : <Navigate to="/browse" replace />} />
              <Route path="/signup" element={!isLoggedIn ? <SignUpPage onLogin={() => setIsLoggedIn(true)} /> : <Navigate to="/browse" replace />} />
              <Route path="/forgot-password" element={!isLoggedIn ? <ForgotPasswordPage /> : <Navigate to="/browse" replace />} />
              <Route path="/verify-otp" element={!isLoggedIn ? <VerifyOtpPage /> : <Navigate to="/browse" replace />} />
              <Route path="/reset-password" element={!isLoggedIn ? <ResetPasswordPage /> : <Navigate to="/browse" replace />} />
              
              <Route path="/browse" element={isLoggedIn ? <div className="flex flex-col min-h-screen"><Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} /><BrowsePage /></div> : <Navigate to="/login" replace />} />
              <Route path="/project/:id" element={isLoggedIn ? <div className="flex flex-col min-h-screen"><Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} /><ProjectDetailsPage /></div> : <Navigate to="/" replace />} />
              <Route path="/apply/:id" element={isLoggedIn ? <div className="flex flex-col min-h-screen"><Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} /><ApplyPage /></div> : <Navigate to="/" replace />} />
              <Route path="/manage" element={isLoggedIn ? <div className="flex flex-col min-h-screen"><Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} /><ManageProjectsPage /></div> : <Navigate to="/login" replace />} />
              <Route path="/manage/project/:id" element={isLoggedIn ? <div className="flex flex-col min-h-screen"><Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} /><ProjectDashboardPage /></div> : <Navigate to="/" replace />} />
              <Route path="/new-project" element={isLoggedIn ? <div className="flex flex-col min-h-screen"><Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} /><CreateProjectPage /></div> : <Navigate to="/login" replace />} />
              <Route path="/edit-project/:id" element={isLoggedIn ? <div className="flex flex-col min-h-screen"><Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} /><CreateProjectPage /></div> : <Navigate to="/" replace />} />
              <Route path="/profile" element={isLoggedIn ? <div className="flex flex-col min-h-screen"><Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} /><ProfilePage /></div> : <Navigate to="/" replace />} />
              <Route path="/applicants/profile/:applicantId" element={isLoggedIn ? <div className="flex flex-col min-h-screen"><Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} /><CandidateProfilePage /></div> : <Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ProjectProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;