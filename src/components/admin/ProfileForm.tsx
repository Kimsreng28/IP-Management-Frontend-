import React, { useState } from 'react';
import {
    Save,
    Loader2,
    User,
    Mail,
    Phone,
    UserCircle,
    Calendar,
    MapPin,
    Globe
} from 'lucide-react';
import type { UpdateAdminProfileDto } from '../../types/adminProfile.types';

interface ProfileFormProps {
    profile: {
        name_kh: string;
        name_en: string;
        email: string;
        phone: string;
        gender: string;
        dob: string;
        address: string;
    };
    onSubmit: (data: UpdateAdminProfileDto) => Promise<void>;
    isLoading?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
    profile,
    onSubmit,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState({
        name_kh: profile.name_kh,
        name_en: profile.name_en,
        email: profile.email,
        phone: profile.phone,
        gender: profile.gender,
        dob: profile.dob,
        address: profile.address,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Only submit changed fields
        const changedData: UpdateAdminProfileDto = {};
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== profile[key as keyof typeof profile]) {
                changedData[key as keyof UpdateAdminProfileDto] = value;
            }
        });

        if (Object.keys(changedData).length > 0) {
            await onSubmit(changedData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {/* Name (Khmer) */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>Name (Khmer)</span>
                    </label>

                    <input
                        type="text"
                        name="name_kh"
                        value={formData.name_kh}
                        onChange={handleChange}
                        className="w-full pl-3 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
                        required
                        placeholder="Enter Khmer name"
                    />

                </div>

                {/* Name (English) */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <span>Name (English)</span>
                    </label>

                    <input
                        type="text"
                        name="name_en"
                        value={formData.name_en}
                        onChange={handleChange}
                        className="w-full pl-3 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
                        required
                        placeholder="Enter English name"
                    />

                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>Email Address</span>
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-3 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 cursor-not-allowed"
                        required
                        disabled
                        placeholder="your@email.com"
                    />

                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <span className='text-red-500'>*</span>
                        Email cannot be changed
                    </p>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>Phone Number</span>
                    </label>

                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-3 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
                        required
                        placeholder="Enter phone number"
                    />

                </div>

                {/* Gender */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <UserCircle className="w-4 h-4 text-gray-500" />
                        <span>Gender</span>
                    </label>

                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full pl-3 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400 appearance-none bg-white"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>Date of Birth</span>
                    </label>

                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full pl-3 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400 text-gray-700"
                        required
                    />

                </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>Address</span>
                </label>

                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full pl-3 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400 resize-none"
                    required
                    placeholder="Enter your address"
                />

            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-3 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 flex items-center gap-2 text-sm sm:text-base font-medium"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                            <span>Saving Changes...</span>
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Save Change</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};