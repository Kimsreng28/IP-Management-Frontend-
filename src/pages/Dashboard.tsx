import React from 'react';
import { Users, Calendar, BookOpen, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
    const stats = [
        {
            title: 'Total Students',
            value: '1,234',
            icon: Users,
            color: 'bg-blue-500',
            change: '+12%',
            trend: 'up'
        },
        {
            title: 'Attendance Today',
            value: '89%',
            icon: Calendar,
            color: 'bg-green-500',
            change: '+5%',
            trend: 'up'
        },
        {
            title: 'Library Books',
            value: '5,678',
            icon: BookOpen,
            color: 'bg-purple-500',
            change: '+23',
            trend: 'up'
        },
        {
            title: 'Performance',
            value: '85%',
            icon: TrendingUp,
            color: 'bg-orange-500',
            change: '+8%',
            trend: 'up'
        }
    ];

    const recentActivities = [
        { id: 1, action: 'New student registered', time: '2 min ago' },
        { id: 2, action: 'Math assignment submitted', time: '15 min ago' },
        { id: 3, action: 'Library book returned', time: '1 hour ago' },
        { id: 4, action: 'Attendance marked', time: '2 hours ago' },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                    <p className={`text-sm mt-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                        {stat.change} from last week
                                    </p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-full`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts and Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-800">{activity.action}</p>
                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                            <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-700">Mark Attendance</span>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                            <BookOpen className="w-6 h-6 text-green-500 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-700">Browse Library</span>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
                            <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-700">View Students</span>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors">
                            <TrendingUp className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-700">Reports</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;