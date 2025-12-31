import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2, Check } from 'lucide-react';

interface ChangePasswordFormProps {
    onSubmit: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
    isLoading?: boolean;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
    onSubmit,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (error) setError('');
        if (success) setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate passwords match
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        // Validate password strength
        if (formData.newPassword.length < 8) {
            setError('New password must be at least 8 characters long');
            return;
        }

        try {
            await onSubmit({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });

            setSuccess(true);
            // Clear form after successful submission
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            // Reset success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            // Error is handled by the parent component
        }
    };

    // Password strength indicator
    const getPasswordStrength = (password: string) => {
        if (password.length === 0) return { strength: 0, color: 'bg-gray-200', text: '' };
        if (password.length < 8) return { strength: 33, color: 'bg-red-500', text: 'Weak' };

        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecial].filter(Boolean).length * 25;

        if (strength >= 75) return { strength, color: 'bg-green-500', text: 'Strong' };
        if (strength >= 50) return { strength, color: 'bg-yellow-500', text: 'Medium' };
        return { strength, color: 'bg-red-500', text: 'Weak' };
    };

    const newPasswordStrength = getPasswordStrength(formData.newPassword);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {success && (
                <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                    <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0 mt-0.5 sm:mt-0" />
                        <p className="text-sm font-medium text-green-800">Password changed successfully!</p>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                    <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                        <div className="shrink-0 mt-0.5 sm:mt-0">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                </div>
            )}

            <div className="space-y-4 sm:space-y-5">
                {/* Current Password */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                        Current Password
                    </label>
                    <div className="relative group">
                        <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 pr-10 sm:pr-12 text-sm sm:text-base"
                            required
                            placeholder="Enter current password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-10 sm:w-12 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                            aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                            tabIndex={-1}
                        >
                            {showCurrentPassword ? (
                                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : (
                                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                        New Password
                    </label>
                    <div className="relative group">
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 pr-10 sm:pr-12 text-sm sm:text-base"
                            required
                            placeholder="Enter new password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-10 sm:w-12 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                            tabIndex={-1}
                        >
                            {showNewPassword ? (
                                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : (
                                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                        </button>
                    </div>

                    {/* Password strength indicator */}
                    {formData.newPassword && (
                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Password strength</span>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded ${newPasswordStrength.text === 'Strong' ? 'bg-green-100 text-green-700' :
                                    newPasswordStrength.text === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {newPasswordStrength.text}
                                </span>
                            </div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${newPasswordStrength.color} transition-all duration-500 ease-out`}
                                    style={{ width: `${newPasswordStrength.strength}%` }}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${formData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    <span className="text-xs text-gray-600">8+ characters</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${/[A-Z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    <span className="text-xs text-gray-600">Uppercase letter</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${/\d/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    <span className="text-xs text-gray-600">Number</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    <span className="text-xs text-gray-600">Special character</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                    </label>
                    <div className="relative group">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 pr-10 sm:pr-12 text-sm sm:text-base ${formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-300'
                                }`}
                            required
                            placeholder="Confirm new password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-10 sm:w-12 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : (
                                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                        </button>
                    </div>
                    {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                        <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                            <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            Passwords do not match
                        </p>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 flex items-center justify-center gap-2 text-sm sm:text-base font-medium"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                            <span>Changing Password...</span>
                        </>
                    ) : (
                        <>
                            <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Change Password</span>
                        </>
                    )}
                </button>
                <p className="text-xs text-gray-500 mt-3 text-center sm:text-left">
                    Make sure your password is strong and unique
                </p>
            </div>
        </form>
    );
};