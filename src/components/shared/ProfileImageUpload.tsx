import React, { useState, useRef } from 'react';
import { Camera, Loader2, User, Upload } from 'lucide-react';

interface ProfileImageUploadProps {
    currentImage?: string;
    onImageUpload: (file: File) => Promise<void>;
    isLoading?: boolean;
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
    currentImage,
    onImageUpload,
    isLoading = false,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Please select a valid image file (JPEG, PNG, JPG, GIF, WebP)');
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('Image size should be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);

        try {
            await onImageUpload(file);
            setPreviewUrl(null);
        } catch (error) {
            setPreviewUrl(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const placeholderAvatar = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23e5e7eb'/%3E%3Cpath d='M50 30a20 20 0 1 0 0 40 20 20 0 0 0 0-40zm0 5a15 15 0 1 1 0 30 15 15 0 0 1 0-30zm0 24a9 9 0 0 0-9 9h18a9 9 0 0 0-9-9z' fill='%239ca3af'/%3E%3C/svg%3E`;

    const hasImage = !!(currentImage || previewUrl);

    return (
        <div className="relative group flex flex-col items-center">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer">
                <img
                    src={previewUrl || currentImage || placeholderAvatar}
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onClick={triggerFileInput}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = placeholderAvatar;
                    }}
                />
                <div
                    className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                    onClick={triggerFileInput}
                >
                    <Camera className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                {isLoading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-white animate-spin" />
                    </div>
                )}
                {!currentImage && !previewUrl && (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                        <User className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
                    </div>
                )}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                className="hidden"
            />
            <div className="mt-3 flex flex-col items-center">
                <button
                    type="button"
                    onClick={triggerFileInput}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={isLoading}
                >
                    <Upload className="w-4 h-4" />
                    {hasImage ? "Change Photo" : "Upload New Photo"}
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">Max 5MB • JPEG, PNG, GIF, WebP</p>
            </div>
        </div>
    );
};