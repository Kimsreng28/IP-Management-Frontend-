import type React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; 
import { X, LogOut } from "lucide-react";
import { getRoutesByRole, routeConfigs } from "../../configs/navigation";
import { useAuthStore } from "../../stores/useAuthStore";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  userRole = "ADMIN",
}) => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate(); 
  const { logout } = useAuthStore();

  const normalizedRole = userRole?.trim().toUpperCase() as keyof typeof routeConfigs;
  const roleMenu = getRoutesByRole(normalizedRole) || getRoutesByRole("ADMIN");

  const handleLogout = async () => {
    await logout();   
    onClose();         
    navigate("/login", { replace: true });  
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-[220px] bg-[#131C2E] shadow-lg
          transform transition-transform duration-300 ease-in-out
          flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:inset-0
        `}
      >
        {/* Header */}
        <div className="shrink-0">
          <div className="flex items-center justify-between px-4 py-6 border-b border-white/10">
            <div className="text-white">
              <h1 className="text-xl font-bold leading-tight">RTC KcKp</h1>
              <p className="text-sm opacity-90 leading-tight">Region Training Center</p>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded text-white/80 hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {roleMenu.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center px-3 py-3 text-white/90 rounded-md
                      transition-colors duration-200
                      hover:bg-white/5
                      ${isActive ? "bg-white/10 font-medium" : ""}
                    `}
                  >
                    <Icon className="w-5 h-5 mr-3 shrink-0" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="shrink-0 border-t border-white/20 pt-4">
          <div className="px-3 pb-6">
            <button
              onClick={handleLogout}
              className={`
                flex items-center w-full px-3 py-3 text-white/90 rounded-md
                transition-colors duration-200
                hover:bg-white/5
              `}
            >
              <LogOut className="w-5 h-5 mr-3 shrink-0" />
              <span className="text-sm">Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;