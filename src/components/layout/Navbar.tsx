import React, { useState } from 'react';
import { Bell, User, Menu, Search } from 'lucide-react';

interface NavbarProps {
    onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const notifications = [
        { id: 1, message: 'New assignment posted', time: '5 min ago' },
        { id: 2, message: 'Class schedule updated', time: '1 hour ago' },
        { id: 3, message: 'Meeting reminder', time: '2 hours ago' },
    ];

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
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setNotificationsOpen(!notificationsOpen);
                                setProfileOpen(false);
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {notificationsOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                                        >
                                            <p className="text-sm text-gray-800">{notification.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-2 border-t border-gray-200">
                                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 py-2">
                                        View All Notifications
                                    </button>
                                </div>
                            </div>
                        )}
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
                            <span className="hidden md:block text-sm font-medium">John Doe</span>
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                <div className="p-4 border-b border-gray-200">
                                    <p className="text-sm font-medium text-gray-800">John Doe</p>
                                    <p className="text-xs text-gray-500">Student</p>
                                </div>
                                <div className="p-2">
                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                        My Profile
                                    </button>
                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                        Settings
                                    </button>
                                    <button
                                        onClick={() => console.log('Logout')}
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