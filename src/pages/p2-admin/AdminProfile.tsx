import React, { useEffect, useState } from 'react';
import { Loader2, User, Shield, AlertCircle, Calendar, Phone, MapPin, Mail } from 'lucide-react';
import { useAdminProfile } from '../../hooks/useAdminProfile';
import { ProfileImageUpload } from '../../components/admin/ProfileImageUpload';
import { ProfileForm } from '../../components/admin/ProfileForm';
import { ChangePasswordForm } from '../../components/admin/ChangePasswordForm';

const AdminProfile = () => {
  const {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    changePassword,
    updateProfileImage,
  } = useAdminProfile();

  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdateProfile = async (data: any) => {
    try {
      const response = await updateProfile(data);
      if (response.success) {
        setSuccessMessage('Profile updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      // Error is handled in the hook
    }
  };

  const handleChangePassword = async (data: any) => {
    try {
      const response = await changePassword(data);
      if (response.success) {
        setSuccessMessage('Password changed successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        setActiveTab('profile');
      }
    } catch (err) {
      // Error is handled in the hook
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const response = await updateProfileImage(file);
      if (response.success) {
        setSuccessMessage('Profile image updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      // Error is handled in the hook
    }
  };

  // Loading state
  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => fetchProfile()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 md:mb-6 animate-fade-in">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm md:text-base font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 md:mb-6 animate-fade-in">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm md:text-base font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-4 py-6 sm:px-6 md:px-8 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Profile</h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">Manage your account settings and profile information</p>
              </div>
              <div className="inline-flex justify-start sm:justify-center">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 whitespace-nowrap 
                      sm:px-3 sm:py-1.5 sm:text-sm
                      md:px-4 md:py-1.5">
                  {profile.role}
                </span>
              </div>
            </div>
          </div>

          <div className="md:flex">
            {/* Sidebar - Mobile first, then desktop sidebar */}
            <div className="md:w-64 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="p-4 sm:p-6">
                <ProfileImageUpload
                  currentImage={profile.image}
                  onImageUpload={handleImageUpload}
                  isLoading={loading}
                />

                {/* Profile Info Summary - Mobile only */}
                <div className="mt-6 md:hidden">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 truncate">{profile.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{profile.phone}</span>
                    </div>
                    {profile.address && (
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-sm text-gray-600 flex-1">{profile.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="mt-6 md:mt-8">
                  <div className="flex md:flex-col overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ${activeTab === 'profile'
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <User className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">Profile Information</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('password')}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ml-2 md:ml-0 md:mt-2 ${activeTab === 'password'
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <Shield className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">Change Password</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="p-4 sm:p-6 md:p-8">
                {activeTab === 'profile' ? (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Profile Information</h2>
                      <p className="text-gray-600 mt-1">Update your personal information and contact details</p>
                    </div>
                    <ProfileForm
                      profile={profile}
                      onSubmit={handleUpdateProfile}
                      isLoading={loading}
                    />
                  </div>
                ) : (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Change Password</h2>
                      <p className="text-gray-600 mt-1">Update your password to keep your account secure</p>
                    </div>
                    <ChangePasswordForm
                      onSubmit={handleChangePassword}
                      isLoading={loading}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-2 md:p-3 bg-blue-50 rounded-lg">
                <User className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm text-gray-600">Account Status</p>
                <p className={`text-base md:text-lg font-semibold ${profile.is_active ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {profile.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-2 md:p-3 bg-green-50 rounded-lg">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm text-gray-600">Member Since</p>
                <p className="text-base md:text-lg font-semibold text-gray-900">
                  {new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-2 md:p-3 bg-purple-50 rounded-lg">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm text-gray-600">Last Updated</p>
                <p className="text-base md:text-lg font-semibold text-gray-900">
                  {new Date(profile.updated_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-2 md:p-3 bg-orange-50 rounded-lg">
                <Phone className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm text-gray-600">Phone Verified</p>
                <p className="text-base md:text-lg font-semibold text-gray-900">
                  {profile.phone ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info - Desktop only */}
        <div className="mt-6 md:mt-8 hidden md:block">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Address</p>
                    <p className="text-gray-600 mt-1">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone Number</p>
                    <p className="text-gray-600 mt-1">{profile.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-gray-600 mt-1">{profile.address || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Date of Birth</p>
                    <p className="text-gray-600 mt-1">{profile.dob || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;