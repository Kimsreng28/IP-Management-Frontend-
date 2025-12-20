import React, { useState } from 'react';
import {
    Save,
    Loader2,
    User,
    Mail,
    Phone,
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
            {/* Personal Information Section */}
            <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#131C2E]" />
                    Personal Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name (Khmer) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Khmer Name *
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="name_kh"
                                value={formData.name_kh}
                                onChange={handleChange}
                                placeholder="Enter Khmer name"
                                className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Name (English) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            English Name *
                        </label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="name_en"
                                value={formData.name_en}
                                onChange={handleChange}
                                placeholder="Enter English name"
                                className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                readOnly
                                disabled
                                className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed outline-none"
                                title="Email cannot be changed"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Email address cannot be modified
                        </p>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+855 12 345 678"
                                className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Birth *
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender *
                        </label>
                        <div className="flex gap-3">
                            {(["Male", "Female"] as const).map((gender) => (
                                <button
                                    key={gender}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, gender }))}
                                    className={`flex-1 py-2.5 px-4 rounded-lg border transition-colors font-medium ${formData.gender === gender
                                            ? gender === "Male"
                                                ? "bg-blue-100 text-blue-800 border-blue-300"
                                                : "bg-pink-100 text-pink-800 border-pink-300"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    {gender}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter full address"
                            rows={2}
                            className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="border-t border-gray-200 pt-4 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => {/* Close modal logic here */ }}
                    className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    disabled={isLoading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-[#131C2E] text-white rounded-lg hover:bg-[#1B2742] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Update Profile"
                    )}
                </button>
            </div>
        </form>
    );
};