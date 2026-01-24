"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Bell, Menu, User, Moon, Sun, Settings, LogOut, ChevronDown } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllRoutes } from "../../configs/navigation";
import { useProfile } from "../../hooks/useProfile";
import { useAuthStore } from "../../stores/useAuthStore";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onMenuClick,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // Initialize theme from localStorage or system preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("theme") as "light" | "dark";
      if (savedTheme) {
        return savedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
    }
    return "light";
  });

  const location = useLocation();
  const allRoutes = getAllRoutes();
  const navigate = useNavigate();
  const { authUser, logout } = useAuthStore();

  // Fetch profile
  const { profile, fetchProfile } = useProfile();

  // Refs for dropdown close on outside click
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Fetch profile when component mounts
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Apply theme to document on mount and when theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  // Get the correct profile page based on role
  const getProfilePath = () => {
    if (!authUser) return "/login";
    switch (authUser.role) {
      case "ADMIN":
        return "/admin/profile";
      case "HEAD_OF_DEPARTMENT":
        return "/hod/profile";
      case "TEACHER":
        return "/teacher/profile";
      case "STUDENT":
        return "/student/profile";
      default:
        return "/login";
    }
  };

  // Get the correct settings page based on role
  const getSettingsPath = () => {
    if (!authUser) return "/login";
    // For now, redirect to dashboard
    switch (authUser.role) {
      case "ADMIN":
        return "/admin/dashboard";
      case "HEAD_OF_DEPARTMENT":
        return "/hod/dashboard";
      case "TEACHER":
        return "/teacher/dashboard";
      case "STUDENT":
        return "/student/dashboard";
      default:
        return "/login";
    }
  };

  // Format role for display
  const formatRole = (role: string) => {
    if (!role) return "User";
    return role
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get display name - handle different profile data structures
  const getDisplayName = () => {
    if (!profile) {
      // Fallback to auth user name
      return authUser?.name || "User";
    }

    // Check all possible name fields
    if (profile.name_en) return profile.name_en;
    if (profile.name) return profile.name;
    if (profile.fullName) return profile.fullName;
    if (profile.username) return profile.username;
    if (profile.email) return profile.email.split('@')[0];

    // Final fallback
    return authUser?.name || "User";
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  // Get profile image - handle different profile data structures
  const getProfileImage = () => {
    if (!profile) return '/default-avatar.png';

    // Check all possible image fields
    if (profile.image) return profile.image;
    if (profile.avatar) return profile.avatar;
    if (profile.profileImage) return profile.profileImage;
    if (profile.imageUrl) return profile.imageUrl;

    return '/default-avatar.png';
  };

  // Get email - handle different profile data structures
  const getEmail = () => {
    if (!profile) {
      return authUser?.email || "";
    }

    if (profile.email) return profile.email;
    return authUser?.email || "";
  };

  // Navigation handlers
  const handleProfileClick = () => {
    const profilePath = getProfilePath();
    navigate(profilePath);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setProfileOpen(false);
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
    <header className="bg-white dark:bg-[#131C2E] shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Page Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right Section - Notifications & Profile */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileOpen(false);
              }}
              className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#131C2E] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors">
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      New student registered
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      5 minutes ago
                    </p>
                  </div>
                  <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors">
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      Attendance report ready
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      1 hour ago
                    </p>
                  </div>
                  <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      System update completed
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      2 hours ago
                    </p>
                  </div>
                </div>
                <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                  <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 py-2">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile with hover tooltip below and dropdown menu */}
          <div
            className="relative"
            ref={profileRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              aria-label="Profile menu"
            >
              {/* Avatar */}
              <div className="relative">
                {getProfileImage() !== '/default-avatar.png' ? (
                  <img
                    src={getProfileImage()}
                    alt={getDisplayName()}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      // Show fallback avatar
                      const fallback = e.currentTarget.parentElement?.querySelector('.avatar-fallback');
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`avatar-fallback w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center ${getProfileImage() !== '/default-avatar.png' ? 'hidden' : ''}`}>
                  <span className="text-white font-medium text-lg">
                    {getInitials()}
                  </span>
                </div>
              </div>

              {/* User info - visible on larger screens */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {getDisplayName()}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
                  {formatRole(authUser?.role || "")}
                </p>
              </div>

              {/* Chevron icon */}
              <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Hover Tooltip (appears below) */}
            {isHovering && !profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-lg shadow-lg z-40 animate-fadeIn">
                <div className="p-3">
                  <div className="font-semibold truncate">{getDisplayName()}</div>
                  <div className="text-gray-300 text-xs mt-0.5">{formatRole(authUser?.role || "")}</div>
                  <div className="text-gray-400 text-xs mt-1 truncate">{getEmail()}</div>
                </div>
              </div>
            )}

            {/* Profile Dropdown (when clicked) */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#131C2E] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 animate-fadeIn">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {getProfileImage() !== '/default-avatar.png' ? (
                        <img
                          src={getProfileImage()}
                          alt={getDisplayName()}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.parentElement?.querySelector('.dropdown-fallback');
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`dropdown-fallback w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center ${getProfileImage() !== '/default-avatar.png' ? 'hidden' : ''}`}>
                        <span className="text-white font-medium text-xl">
                          {getInitials()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white truncate max-w-[160px]">
                        {getDisplayName()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatRole(authUser?.role || "")}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate max-w-[160px]">
                        {getEmail()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {theme === "light" ? (
                      <Moon className="w-4 h-4" />
                    ) : (
                      <Sun className="w-4 h-4" />
                    )}
                    <span>Switch to {theme === "light" ? "Dark" : "Light"} Mode</span>
                  </button>

                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
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