import React, { useState } from 'react';
import { Bell, User, Menu } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { authUser, logout } = useAuthStore();

  const notifications = [
    { id: 1, message: 'New assignment posted', time: '5 min ago' },
    { id: 2, message: 'Class schedule updated', time: '1 hour ago' },
    { id: 3, message: 'Meeting reminder', time: '2 hours ago' },
  ];

  const handleLogout = async () => {
    await logout();
  };

  if (!authUser) return null;

  // Format role for display
  const formatRole = (role: string) => {
    return role.replace(/_/g, ' ');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Welcome back, {authUser.name || authUser.email.split('@')[0]}
            </h2>
            <p className="text-sm text-gray-500 capitalize">{formatRole(authUser.role)} Dashboard</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications - same as before */}
          <div className="relative">
            {/* ... notification code remains the same ... */}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <span className="text-sm font-medium block">{authUser.name || 'User'}</span>
                <span className="text-xs text-gray-500 capitalize">{formatRole(authUser.role)}</span>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-800">{authUser.name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{formatRole(authUser.role)}</p>
                  <p className="text-xs text-gray-400">{authUser.email}</p>
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => window.location.href = '/profile'}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    My Profile
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;