import React from 'react';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  GraduationCap,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  BarChart3
} from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Trainees',
      value: '248',
      icon: Users,
      color: 'bg-blue-500',
      change: '+8%',
      trend: 'up',
      description: 'Active trainees'
    },
    {
      title: 'Current Batch',
      value: 'Batch #42',
      icon: GraduationCap,
      color: 'bg-green-500',
      change: 'IT & Programming',
      trend: 'info',
      description: 'Ongoing training'
    },
    {
      title: 'Attendance Rate',
      value: '94%',
      icon: CheckCircle,
      color: 'bg-purple-500',
      change: '+3%',
      trend: 'up',
      description: 'This week'
    },
    {
      title: 'Pending Requests',
      value: '12',
      icon: AlertCircle,
      color: 'bg-orange-500',
      change: '-4',
      trend: 'down',
      description: 'Leave applications'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New trainee registered - John Doe', time: '30 min ago', type: 'registration' },
    { id: 2, action: 'Batch #42 attendance completed', time: '2 hours ago', type: 'attendance' },
    { id: 3, action: '3 new library resources added', time: '4 hours ago', type: 'library' },
    { id: 4, action: 'Certificate issued for IT Fundamentals', time: '1 day ago', type: 'certificate' },
    { id: 5, action: 'Training schedule updated', time: '2 days ago', type: 'schedule' },
  ];

  const quickActions = [
    {
      title: 'Mark Attendance',
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'hover:bg-blue-50',
      borderColor: 'hover:border-blue-500',
      onClick: () => navigate('/attendance')
    },
    {
      title: 'Manage Trainees',
      icon: Users,
      color: 'text-green-500',
      bgColor: 'hover:bg-green-50',
      borderColor: 'hover:border-green-500',
      onClick: () => console.log('Manage trainees')
    },
    {
      title: 'E-Library',
      icon: BookOpen,
      color: 'text-purple-500',
      bgColor: 'hover:bg-purple-50',
      borderColor: 'hover:border-purple-500',
      onClick: () => navigate('/e-library')
    },
    {
      title: 'Leave Requests',
      icon: FileText,
      color: 'text-orange-500',
      bgColor: 'hover:bg-orange-50',
      borderColor: 'hover:border-orange-500',
      onClick: () => navigate('/leave-request')
    },
    {
      title: 'Reports',
      icon: BarChart3,
      color: 'text-indigo-500',
      bgColor: 'hover:bg-indigo-50',
      borderColor: 'hover:border-indigo-500',
      onClick: () => console.log('Generate reports')
    },
    {
      title: 'Certificates',
      icon: GraduationCap,
      color: 'text-red-500',
      bgColor: 'hover:bg-red-50',
      borderColor: 'hover:border-red-500',
      onClick: () => console.log('Issue certificates')
    }
  ];

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'registration': return <Users className="w-4 h-4 text-blue-500" />;
      case 'attendance': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'library': return <BookOpen className="w-4 h-4 text-purple-500" />;
      case 'certificate': return <GraduationCap className="w-4 h-4 text-orange-500" />;
      case 'schedule': return <Clock className="w-4 h-4 text-indigo-500" />;
      default: return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header with Welcome Message */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {authUser?.name || authUser?.email || 'User'}! 
            <span className="text-sm text-gray-500 ml-2">
              Last login: Today, 09:42 AM
            </span>
          </p>
        </div>
        <div className="flex items-center space-x-3">
  <button 
    onClick={() => navigate('/profile')}
    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
  >
    View Profile
  </button>
  <button 
  onClick={async () => {
    console.log('Logout button clicked');
    try {
      await logout();
      console.log('Logout completed, navigating to login');
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      navigate('/login'); // Still navigate even if logout fails
    }
  }}
  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
>
  Logout
</button>
</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const trendColor = stat.trend === 'up' ? 'text-green-600' : 
                           stat.trend === 'down' ? 'text-red-600' : 'text-blue-600';
          const trendIcon = stat.trend === 'up' ? '↗' : 
                           stat.trend === 'down' ? '↘' : '→';
          
          return (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${trendColor}`}>
                      {trendIcon} {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">{stat.description}</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts, Activities, and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {activity.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`p-4 border border-gray-200 rounded-xl ${action.bgColor} ${action.borderColor} transition-all duration-200 hover:shadow-sm flex flex-col items-center`}
                >
                  <Icon className={`w-8 h-8 ${action.color} mb-3`} />
                  <span className="text-sm font-medium text-gray-700 text-center">{action.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            View Calendar
          </button>
        </div>
        <div className="space-y-3">
          {[
            { time: '09:00 AM', activity: 'IT Fundamentals - Batch #42', location: 'Lab A', trainer: 'Mr. Smith' },
            { time: '11:00 AM', activity: 'Programming Workshop', location: 'Lab B', trainer: 'Ms. Johnson' },
            { time: '02:00 PM', activity: 'Soft Skills Training', location: 'Auditorium', trainer: 'Dr. Williams' },
            { time: '04:00 PM', activity: 'Project Review Session', location: 'Conference Room', trainer: 'Mr. Brown' }
          ].map((schedule, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-16 text-sm font-medium text-gray-900">{schedule.time}</div>
                <div>
                  <p className="font-medium text-gray-800">{schedule.activity}</p>
                  <p className="text-sm text-gray-500">{schedule.location} • {schedule.trainer}</p>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section - Reports & Downloads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Quick Reports</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {[
              { title: 'Monthly Attendance Report', date: 'Dec 2023', status: 'Ready' },
              { title: 'Trainee Performance Analysis', date: 'Q4 2023', status: 'Pending' },
              { title: 'Training Completion Rates', date: 'Nov 2023', status: 'Ready' },
              { title: 'Resource Utilization', date: 'Current Month', status: 'In Progress' }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{report.title}</p>
                  <p className="text-sm text-gray-500">Generated: {report.date}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    report.status === 'Ready' ? 'bg-green-100 text-green-800' :
                    report.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {report.status}
                  </span>
                  {report.status === 'Ready' && (
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">System Status</h2>
          <div className="space-y-4">
            {[
              { service: 'Attendance System', status: 'Operational', uptime: '99.9%' },
              { service: 'E-Library Portal', status: 'Operational', uptime: '99.8%' },
              { service: 'Certificate Generation', status: 'Maintenance', uptime: '98.5%' },
              { service: 'API Services', status: 'Operational', uptime: '99.7%' }
            ].map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{service.service}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${
                      service.status === 'Operational' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <span className="text-sm text-gray-600">{service.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{service.uptime}</p>
                  <p className="text-xs text-gray-500">uptime</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Last updated: Today, 10:00 AM</span>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Refresh Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;