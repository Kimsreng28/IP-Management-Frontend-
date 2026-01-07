import { useState, useRef } from "react";
import {
  X,
  User,
  Phone,
  Calendar,
  GraduationCap,
  Upload,
  Loader2,
} from "lucide-react";
import { useHodStore } from "../../../stores/useHodStore";
import toast from "react-hot-toast";

interface CreateHodProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  name_kh: string;
  name_en: string;
  phone: string;
  gender: "Male" | "Female" | "";
  dob: string;
  address: string;
  department_id: string;
  image: File | null;
}

interface FormErrors {
  name_kh?: string;
  name_en?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  address?: string;
  department_id?: string;
  image?: string;
}

export default function AdminCreateHod({
  isOpen,
  onClose,
  onSuccess,
}: CreateHodProps) {
  const {
    departments,
    createHod,
    isLoading: isStoreLoading,
  } = useHodStore();

  const [formData, setFormData] = useState<FormData>({
    name_kh: "",
    name_en: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    department_id: "",
    image: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleGenderChange = (gender: "Male" | "Female") => {
    setFormData((prev) => ({ ...prev, gender }));
    if (errors.gender) {
      setErrors((prev) => ({ ...prev, gender: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Only JPG, PNG, GIF, and WebP images are allowed",
        }));
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size must be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      setErrors((prev) => ({ ...prev, image: undefined }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name_kh.trim()) {
      newErrors.name_kh = "Khmer name is required";
    }

    if (!formData.name_en.trim()) {
      newErrors.name_en = "English name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select gender";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const dob = new Date(formData.dob);
      const today = new Date();
      if (dob >= today) {
        newErrors.dob = "Date of birth must be in the past";
      }
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      formDataToSend.append("name_kh", formData.name_kh);
      formDataToSend.append("name_en", formData.name_en);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("dob", formData.dob);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("department_id", formData.department_id);
      
      // Append image if exists
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      // Note: Email will be auto-generated on the backend
      // based on the hod's name or ID
      
      console.log("Creating hod with data:", {
        name_kh: formData.name_kh,
        name_en: formData.name_en,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob,
        address: formData.address,
        department_id: formData.department_id,
        hasImage: !!formData.image,
        // Email will be auto-generated by backend
      });

      // Use the store method to create hod
      await createHod(formDataToSend);
      
      // Reset form
      resetForm();
      
      // Close modal and trigger success callback
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error creating hod:", error);
      // Error toast is already shown by the store method
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name_kh: "",
      name_en: "",
      phone: "",
      gender: "",
      dob: "",
      address: "",
      department_id: "",
      image: null,
    });
    setErrors({});
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const isLoading = isStoreLoading || isSubmitting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-white px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-[#131C2E]" />
            <h2 className="text-2xl font-bold text-gray-900">
              Add New Hod
            </h2>
          </div>

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-200 border-4 border-gray-100 shadow-lg">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-100 to-purple-100">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                className="hidden"
              />

              <button
                type="button"
                onClick={triggerFileInput}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Upload className="w-4 h-4" />
                {formData.image ? "Change Photo" : "Upload Photo"}
              </button>

              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG, GIF, WebP. Max 5MB.
              </p>
              {errors.image && (
                <p className="text-sm text-red-600 mt-1">{errors.image}</p>
              )}
            </div>

            {/* Personal Information */}
            <div className="bg-gray-50 rounded-lg p-5 space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#131C2E]" />
                Personal Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khmer Name *
                  </label>
                  <input
                    type="text"
                    name="name_kh"
                    value={formData.name_kh}
                    onChange={handleInputChange}
                    placeholder="Enter Khmer name"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors ${
                      errors.name_kh
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.name_kh && (
                    <p className="text-sm text-red-600 mt-1">{errors.name_kh}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    English Name *
                  </label>
                  <input
                    type="text"
                    name="name_en"
                    value={formData.name_en}
                    onChange={handleInputChange}
                    placeholder="Enter English name"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors ${
                      errors.name_en
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.name_en && (
                    <p className="text-sm text-red-600 mt-1">{errors.name_en}</p>
                  )}
                </div>

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
                      onChange={handleInputChange}
                      placeholder="+855 12 345 678"
                      className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors ${
                        errors.phone
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>

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
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors ${
                        errors.dob
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.dob && (
                    <p className="text-sm text-red-600 mt-1">{errors.dob}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <div className="flex gap-3">
                    {(["Male", "Female"] as const).map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => handleGenderChange(gender)}
                        className={`flex-1 py-2.5 px-4 rounded-lg border transition-colors font-medium ${
                          formData.gender === gender
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
                  {errors.gender && (
                    <p className="text-sm text-red-600 mt-1">{errors.gender}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter full address"
                  rows={2}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors ${
                    errors.address
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.address && (
                  <p className="text-sm text-red-600 mt-1">{errors.address}</p>
                )}
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-gray-50 rounded-lg p-5 space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#131C2E]" />
                Professional Information
              </h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <select
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors appearance-none cursor-pointer ${
                      errors.department_id
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.department_id && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.department_id}
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2.5 bg-[#131C2E] text-white rounded-lg hover:bg-[#1B2742] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Hod"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}