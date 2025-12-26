import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../../lib/axios';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axiosInstance.post('/auth/forgot-password', { email });
            setIsSubmitted(true);
            toast.success('Password reset link sent to your email');
        } catch (error: any) {
            console.error('Forgot password error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to send reset link';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
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
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                            <p className="text-gray-600">
                                If an account exists with {email}, you'll receive a password reset link shortly.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <Link
                                to="/login"
                                className="block w-full h-11 bg-[#131C2E] hover:bg-[#1B2742] text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                            >
                                Back to Login
                            </Link>
                            <p className="text-sm text-gray-500">
                                Didn't receive the email? Check your spam folder or{' '}
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    try again
                                </button>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

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
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
                        <p className="text-gray-600 text-sm">
                            Enter your email address and we'll send you a link to reset your password
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-11 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] placeholder:text-gray-400"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 bg-[#131C2E] hover:bg-[#1B2742] text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#131C2E] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
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