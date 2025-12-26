import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../../lib/axios';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    isInitialChange?: boolean;
    tempToken?: string;
    onSuccess?: () => void;
}

export default function ChangePasswordModal({
    isOpen,
    onClose,
    isInitialChange = false,
    tempToken,
    onSuccess,
}: ChangePasswordModalProps) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false); // This is a boolean, not an object
    const [passwordStrength, setPasswordStrength] = useState(0);

    useEffect(() => {
        if (isOpen) {
            // Reset form when modal opens
            setNewPassword('');
            setConfirmPassword('');
            setPasswordStrength(0);
            setShowPasswords(false); // Reset to false
        }
    }, [isOpen]);

    const checkPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        return strength;
    };

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        setNewPassword(password);
        setPasswordStrength(checkPasswordStrength(password));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordStrength < 3) {
            toast.error('Password is too weak. Include uppercase, lowercase, numbers, and special characters');
            return;
        }

        setIsLoading(true);

        try {
            if (isInitialChange && tempToken) {
                // Use the special endpoint for initial password change
                await axiosInstance.post(
                    '/auth/change-initial-password',
                    { newPassword },
                    {
                        headers: {
                            Authorization: `Bearer ${tempToken}`,
                        },
                    }
                );
                toast.success('Password changed successfully');
                onClose();
                if (onSuccess) onSuccess();
            } else {
                // Normal password change (not used in modal, but kept for consistency)
                toast.error('Invalid operation');
            }
        } catch (error: any) {
            console.error('Change password error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to change password';
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            Change Your Password
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                            disabled={isLoading}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {isInitialChange && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-blue-800">
                                    For security reasons, you must change your password before accessing the system.
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-900">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    type={showPasswords ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={handleNewPasswordChange}
                                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] placeholder:text-gray-400"
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(!showPasswords)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords ? 'Hide' : 'Show'}
                                </button>
                            </div>

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
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showPasswords ? 'text' : 'password'}  // Fixed: Using the same showPasswords boolean
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] placeholder:text-gray-400"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(!showPasswords)}  // Fixed: Toggling the boolean directly
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="showPasswords"
                                checked={showPasswords}
                                onChange={(e) => setShowPasswords(e.target.checked)}
                                className="h-4 w-4 text-blue-600 rounded"
                            />
                            <label htmlFor="showPasswords" className="ml-2 text-sm text-gray-700">
                                Show passwords
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 h-10 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || passwordStrength < 3}
                                className="flex-1 h-10 bg-[#131C2E] hover:bg-[#1B2742] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Changing...' : 'Change Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}