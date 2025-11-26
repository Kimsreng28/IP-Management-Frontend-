import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    BookOpen,
    User,
    LogOut,
    X
} from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/attendance', icon: Calendar, label: 'Attendance' },
        { path: '/leave-request', icon: Calendar, label: 'Leave Request' },
        { path: '/e-library', icon: BookOpen, label: 'E-Library' },
        { path: '/profile', icon: User, label: 'Profile' },
    ];

    const handleLogout = () => {
        console.log('Logging out...');
        navigate('/login');
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 lg:static lg:inset-0
                border-r-2 border-blue-500 // Added for visibility
            `}>
                {/* Header with close button for mobile */}
                <div className="flex items-center justify-between h-16 px-4 bg-blue-600 text-white">
                    <h1 className="text-xl font-bold">School Portal</h1>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 rounded hover:bg-blue-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-8 px-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        onClick={() => {
                                            console.log('Navigating to:', item.path);
                                            onClose();
                                        }}
                                        className={({ isActive }) => `
                                            flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200
                                            hover:bg-blue-50 hover:text-blue-600
                                            ${isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''}
                                        `}
                                    >
                                        <Icon className="w-5 h-5 mr-3" />
                                        <span className="font-medium">{item.label}</span>
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-4 left-0 right-0 px-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;