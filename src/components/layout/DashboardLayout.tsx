"use client"
import type React from "react"
import { useState } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

interface DashboardLayoutProps {
  userName?: string
  userRole?: string
  userAvatar?: string
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  userName = "User",
  userRole = "ADMIN",
  userAvatar 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        userRole={userRole} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          userName={userName}
          userRole={userRole}
          userAvatar={userAvatar}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet /> {/* Nested routes will render here */}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
