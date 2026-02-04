import React, { useState, useRef, useEffect } from 'react';
import { Bell, Sun, Moon, User, LogOut, ChevronDown, Check } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IMAGES } from '../../../Data/images';
import { Button } from '../../../shared/ui/Button';
import { useTheme } from '../../../context/ThemeContext';
import { useUser } from '../../../context/UserContext';
import NotificationService, { Notification } from '../notifications/service/notification.service';

interface NavbarProps {
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn = false, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { userProfile } = useUser();
  const isActive = (path: string) => location.pathname === path;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = React.useCallback(async () => {
    if (!isLoggedIn) return;
    try {
        const data = await NotificationService.getNotifications();
        const unreadData = data.filter(n => !n.isRead);
        setNotifications(unreadData);
        setUnreadCount(unreadData.length);
    } catch (e) {
        console.error("Failed to fetch notifications");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchNotifications();
    if (isLoggedIn) {
        // Poll every 5 seconds for new notifications (improved real-time feel)
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }
  }, [fetchNotifications, isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
          setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    if (onLogout) onLogout();
    navigate('/');
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const markAsRead = async (id: number) => {
      // Optimistic update
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      await NotificationService.markAsRead(id);
      fetchNotifications();
  };

  const markAllRead = async () => {
      // Optimistic update
      setNotifications([]);
      setUnreadCount(0);
      
      await NotificationService.markAllAsRead();
      fetchNotifications();
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-mine-shaft-950/90 backdrop-blur-md border-b border-mine-shaft-800 py-4 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-bright-sun-400 flex items-center justify-center">
              <span className="text-bright-sun-400 font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-mine-shaft-50">CollabPro</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/browse" 
              className={`font-medium transition-colors ${isActive('/browse') ? 'text-bright-sun-400' : 'text-mine-shaft-50 hover:text-bright-sun-400'}`}
            >
              Browse
            </Link>
            <Link 
              to="/manage" 
              className={`font-medium transition-colors ${isActive('/manage') ? 'text-bright-sun-400' : 'text-mine-shaft-300 hover:text-mine-shaft-50 select-none'}`}
            >
              Manage
            </Link>
            <Link 
              to="/new-project" 
              className={`font-medium transition-colors ${isActive('/new-project') ? 'text-bright-sun-400' : 'text-mine-shaft-300 hover:text-mine-shaft-50'}`}
            >
              New Project
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
           {!isLoggedIn && (
             <button 
               onClick={toggleTheme}
               className="p-2 rounded-full text-mine-shaft-300 hover:text-mine-shaft-50 hover:bg-mine-shaft-800 transition-all"
               aria-label="Toggle theme"
             >
               {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
             </button>
           )}

           {isLoggedIn ? (
             <>
               <div className="relative text-mine-shaft-300 mr-2" ref={notifRef}>
                 <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className={`hover:text-mine-shaft-50 transition-colors relative p-2 rounded-full ${isNotificationsOpen ? 'bg-mine-shaft-800 text-mine-shaft-50' : ''}`}
                 >
                   <Bell size={20} />
                   {unreadCount > 0 && (
                        <span className="absolute top-0 right-0.5 min-w-[16px] h-4 bg-red-500 rounded-full border-2 border-mine-shaft-950 flex items-center justify-center text-[10px] text-white font-bold px-1">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                   )}
                 </button>

                 {isNotificationsOpen && (
                     <div className="absolute top-full right-0 mt-2 w-80 bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                         <div className="p-4 border-b border-mine-shaft-800 flex justify-between items-center bg-mine-shaft-950/50">
                             <h3 className="font-bold text-mine-shaft-50">Notifications</h3>
                             {unreadCount > 0 && <button onClick={markAllRead} className="text-xs text-bright-sun-400 hover:underline">Mark all read</button>}
                         </div>
                         <div className="max-h-80 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map(n => (
                                    <div key={n.id} className={`p-4 border-b border-mine-shaft-800/50 hover:bg-mine-shaft-800 transition-colors ${!n.isRead ? 'bg-mine-shaft-800/30' : ''}`}>
                                        <div className="flex gap-3">
                                            <div className="mt-1">
                                                {n.type === 'REMOVAL' ? (
                                                    <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                                                ) : (
                                                    <div className="w-2 h-2 rounded-full bg-bright-sun-400 mt-1.5 flex-shrink-0" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-sm ${!n.isRead ? 'text-mine-shaft-50 font-medium' : 'text-mine-shaft-300'}`}>{n.message}</p>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-xs text-mine-shaft-500">{new Date(n.createdAt).toLocaleDateString()}</span>
                                                    {!n.isRead && (
                                                        <button onClick={() => markAsRead(n.id)} className="text-mine-shaft-400 hover:text-bright-sun-400" title="Mark as read">
                                                            <Check size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-mine-shaft-500 text-sm">No notifications</div>
                            )}
                         </div>
                     </div>
                 )}
               </div>

               <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 hover:bg-mine-shaft-800 rounded-full py-1 px-2 pr-4 transition-colors border border-transparent hover:border-mine-shaft-700"
                  >
                     <div className="hidden sm:block text-right">
                         <span className="block text-mine-shaft-50 font-medium text-sm leading-tight">{userProfile.name || 'User'}</span>
                         <span className="text-[10px] text-mine-shaft-400">Freelancer</span>
                     </div>
                     <div className="w-9 h-9 rounded-full bg-mine-shaft-700 overflow-hidden border border-mine-shaft-600">
                       <img src={userProfile.profileImage || IMAGES.currentUser} alt="User" className="w-full h-full object-cover" />
                     </div>
                     <ChevronDown size={16} className={`text-mine-shaft-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 w-64 bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                          <div className="p-2 space-y-1">
                              <Link 
                                to="/profile" 
                                onClick={closeDropdown}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-mine-shaft-200 hover:text-mine-shaft-50 hover:bg-mine-shaft-800 rounded-lg transition-colors"
                              >
                                  <User size={18} /> Profile
                              </Link>
                          </div>
                          
                          <div className="h-px bg-mine-shaft-800 mx-2 my-1"></div>
                          
                          <div className="p-2">
                               <div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-mine-shaft-800 transition-colors cursor-pointer group" onClick={toggleTheme}>
                                   <div className="flex items-center gap-3 text-sm text-mine-shaft-200 group-hover:text-mine-shaft-50">
                                       {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                                       Dark mode
                                   </div>
                                   <div className={`w-10 h-5 rounded-full p-0.5 flex items-center transition-colors ${theme === 'dark' ? 'bg-bright-sun-400' : 'bg-mine-shaft-600'}`}>
                                       <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                   </div>
                               </div>
                          </div>

                          <div className="h-px bg-mine-shaft-800 mx-2 my-1"></div>

                          <div className="p-2">
                              <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-mine-shaft-800 rounded-lg transition-colors text-left font-medium"
                              >
                                  <LogOut size={18} /> Logout
                              </button>
                          </div>
                      </div>
                  )}
               </div>
             </>
           ) : (
             <Button 
               onClick={() => navigate('/login')}
               className="bg-bright-sun-400 text-black font-bold hover:bg-bright-sun-500 rounded-full px-6"
             >
               Login
             </Button>
           )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;