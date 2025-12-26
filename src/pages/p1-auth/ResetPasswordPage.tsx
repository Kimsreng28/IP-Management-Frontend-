import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../../lib/axios';

export default function ResetPasswordPage() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const checkPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        return strength;
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        setNewPassword(password);
        setPasswordStrength(checkPasswordStrength(password));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error('Invalid reset token');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (passwordStrength < 3) {
            toast.error('Password is too weak. Include uppercase, lowercase, numbers, and special characters');
            return;
        }

        setIsLoading(true);

        try {
            await axiosInstance.post('/auth/reset-password', {
                token,
                newPassword,
            });
            toast.success('Password reset successfully');
            navigate('/login');
        } catch (error: any) {
            console.error('Reset password error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to reset password';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const getStrengthColor = (strength: number) => {
        if (strength <= 2) return 'bg-red-500';
        if (strength === 3) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16">
                        <div className="flex items-center gap-4">
                            <img
                                src="/src/assets/images/LOGO.png"
                                alt="RTC KcKp Logo"
                                className="w-12 h-12 object-contain"
                            />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">RTC KcKp</h1>
                                <p className="text-xs text-gray-600 -mt-1">Region Training Center</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Set New Password</h2>
                        <p className="text-gray-600 text-sm">Create a new secure password for your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-900">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full h-11 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] placeholder:text-gray-400"
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>

                            {/* Password strength indicator */}
                            {newPassword && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-gray-600">Password strength:</span>
                                        <span className="text-xs font-medium">
                                            {passwordStrength <= 2 ? 'Weak' : passwordStrength === 3 ? 'Medium' : 'Strong'}
                                        </span>
                                    </div>
                                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${getStrengthColor(passwordStrength)} transition-all duration-300`}
                                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Use at least 8 characters with uppercase, lowercase, numbers, and symbols
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full h-11 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] placeholder:text-gray-400"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || passwordStrength < 3}
                            className="w-full h-11 bg-[#131C2E] hover:bg-[#1B2742] text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#131C2E] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>

                        <div className="text-center">
                            <Link
                                to="/login"
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}