"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Bell, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getAllRoutes } from "../../configs/navigation";
import { useHodProfile } from "../../hooks/useHodProfile";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onMenuClick,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const location = useLocation();
  const allRoutes = getAllRoutes();

  // Fetch HOD profile on mount
  const { profile, fetchProfile } = useHodProfile();

  // Fetch profile when component mounts
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Format role for display (convert from uppercase to proper case)
  const formatRole = (role: string) => {
    if (!role) return "User";
    return role
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const currentRoute = allRoutes.find((route) => {
      if (route.path === currentPath) return true;
      if (route.path.includes(":")) {
        const routeParts = route.path.split("/");
        const currentParts = currentPath.split("/");

        if (routeParts.length === currentParts.length) {
          return routeParts.every(
            (part, index) =>
              part.startsWith(":") || part === currentParts[index]
          );
        }
      }
      return false;
    });

    if (currentRoute?.label) {
      setPageTitle(currentRoute.label);
    } else {
      const pathParts = currentPath.split("/").filter((part) => part);
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        const formattedTitle = lastPart
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        setPageTitle(formattedTitle);
      } else {
        setPageTitle("Dashboard");
      }
    }
  }, [location.pathname, allRoutes]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Page Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right Section - Notifications & Profile */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {notificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
                      <p className="text-sm text-gray-800">
                        New student registered
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        5 minutes ago
                      </p>
                    </div>
                    <div className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
                      <p className="text-sm text-gray-800">
                        Attendance report ready
                      </p>
                      <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                    </div>
                    <div className="p-4 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm text-gray-800">
                        System update completed
                      </p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3">
            {profile ? (
              <img
                src={profile.image || '/default-avatar.png'}
                alt={profile.name_en}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 font-medium text-sm">
                  {profile?.name_en.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                {profile?.name_en}
              </p>
              <p className="text-xs text-gray-600 leading-tight">
                {formatRole(profile?.role)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
