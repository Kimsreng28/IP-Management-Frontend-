import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Globe,
    Loader2,
    BookOpen,
    Building2,
    GraduationCap
} from 'lucide-react';

interface ProfileFormProps {
    profile: any;
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
    role: 'STUDENT' | 'TEACHER' | 'HOD' | 'ADMIN';
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
    profile,
    onSubmit,
    isLoading = false,
    role,
}) => {
    // Initialize form data with proper nesting for student info
    const [formData, setFormData] = useState<any>(() => {
        const initialData = { ...profile };

        // Handle nested student info
        if (role === 'STUDENT' && profile.studentInfo) {
            initialData.student_id = profile.studentInfo.student_id || '';
        }

        return initialData;
    });

    useEffect(() => {
        // Update form data when profile changes
        const updatedData = { ...profile };

        if (role === 'STUDENT' && profile.studentInfo) {
            updatedData.student_id = profile.studentInfo.student_id || '';
        }

        setFormData(updatedData);
    }, [profile, role]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const changedData: any = {};

        // Check for changed fields in main profile
        Object.entries(formData).forEach(([key, value]) => {
            // Skip studentInfo object as we'll handle it separately
            if (key === 'studentInfo') return;

            // For student_id, compare with nested studentInfo
            if (role === 'STUDENT' && key === 'student_id') {
                const originalValue = profile.studentInfo?.student_id || '';
                if (value !== originalValue) {
                    changedData[key] = value;
                }
            }
            // For other fields, compare directly
            else if (value !== profile[key]) {
                changedData[key] = value;
            }
        });

        if (Object.keys(changedData).length > 0) {
            await onSubmit(changedData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#131C2E]" />
                    Personal Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name Fields */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Khmer Name *
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="name_kh"
                                value={formData.name_kh || ''}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            English Name *
                        </label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="name_en"
                                value={formData.name_en || ''}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none"
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
                                value={formData.email || ''}
                                readOnly
                                disabled
                                className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                        </div>
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
                                value={formData.phone || ''}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none"
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
                                value={formData.dob || ''}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none"
                            />
                        </div>
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender *
                        </label>
                        <select
                            name="gender"
                            value={formData.gender || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Role-specific fields */}
                    {role === 'STUDENT' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Student ID *
                                </label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="student_id"
                                        value={formData.student_id || ''}
                                        onChange={handleChange}
                                        readOnly
                                        disabled
                                        className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                        title="Student ID cannot be changed"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Student ID cannot be modified
                                </p>
                            </div>

                            {/* Student Year - Read Only */}
                            {profile.studentInfo?.student_year && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Student Year
                                    </label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={`Year ${profile.studentInfo.student_year}`}
                                            readOnly
                                            disabled
                                            className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {role === 'TEACHER' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Teacher ID *
                                </label>
                                <div className="relative">
                                    <BookOpen className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="teacher_id"
                                        value={formData.teacher_id || ''}
                                        onChange={handleChange}
                                        readOnly
                                        disabled
                                        className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                        title="Teacher ID cannot be changed"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Teacher ID cannot be modified
                                </p>
                            </div>
                        </>
                    )}

                    {role === 'HOD' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Department *
                                </label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department || ''}
                                        onChange={handleChange}
                                        readOnly
                                        disabled
                                        className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                        title="Department cannot be changed"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Department cannot be modified
                                </p>
                            </div>
                        </>
                    )}
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
                            value={formData.address || ''}
                            onChange={handleChange}
                            rows={2}
                            className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-[#131C2E] text-white rounded-lg hover:bg-[#1B2742] transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Update Profile'
                    )}
                </button>
            </div>
        </form>
    );
};