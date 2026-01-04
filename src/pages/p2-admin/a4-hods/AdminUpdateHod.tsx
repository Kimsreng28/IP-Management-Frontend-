import { useState, useEffect, useRef } from "react";
import {
  X,
  User,
  Phone,
  Calendar,
  Mail,
  BookOpen,
  MapPin,
  Upload,
  Loader2,
} from "lucide-react";
import { useHodStore } from "../../../stores/useHodStore";
import toast from "react-hot-toast";

interface UpdateHodProps {
  hodId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  name_kh: string;
  name_en: string;
  email: string;
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
  email?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  address?: string;
  department_id?: string;
  image?: string;
}

export default function AdminUpdateHod({
  hodId,
  isOpen,
  onClose,
  onSuccess,
}: UpdateHodProps) {
  const {
    departments,
    updateHod,
    fetchHodById,
    isLoading,
  } = useHodStore();

  const [formData, setFormData] = useState<FormData>({
    name_kh: "",
    name_en: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    department_id: "",
    image: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isFetchingHod, setIsFetchingHod] = useState(false);
  const [, setOriginalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current hod data when modal opens
  useEffect(() => {
    if (isOpen && hodId) {
      fetchHodData();
    }
  }, [isOpen, hodId]);

  // Function to handle image URL for preview
  const getImageUrl = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return null;

    if (imageUrl === "src/public/images/avatar.jpg") {
      return "/src/assets/images/avatar.jpg"; 
    }

    // Handle external URLs
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    const BACKEND_URL =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";
    return `${BACKEND_URL}${
      imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl
    }`;
  };

  const fetchHodData = async () => {
    if (!hodId) return;

    setIsFetchingHod(true);
    try {
      const hod = await fetchHodById(hodId);
      if (hod) {
        // Find department ID by name
        const department = departments.find(
          (dept) => dept.name === hod.department
        );

        setFormData({
          name_kh: hod.name_kh || "",
          name_en: hod.name_en || "",
          email: hod.email || "",
          phone: hod.phone || "",
          gender: hod.gender || "",
          dob: hod.dob
            ? new Date(hod.dob).toISOString().split("T")[0]
            : "",
          address: hod.address || "",
          department_id: department?.id.toString() || "",
          image: null,
        });

        // Set image preview if available
        if (hod.image) {
          setOriginalImage(hod.image);

          // Get the image URL using the helper function
          const imageUrl = getImageUrl(hod.image);
          setImagePreview(imageUrl);
        } else {
          // No image, create a placeholder with the first letter
          const firstLetter = hod.name_en?.[0]?.toUpperCase() || "?";
          setImagePreview(
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Crect fill='%23e5e7eb' width='128' height='128'/%3E%3Ctext x='50%25' y='50%25' font-size='48' text-anchor='middle' dy='.3em' fill='%239ca3af'%3E${firstLetter}%3C/text%3E%3C/svg%3E`
          );
        }
      }
    } catch (error) {
      console.error("Error fetching hod data:", error);
      toast.error("Failed to load hod data");
    } finally {
      setIsFetchingHod(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Don't allow email changes
    if (name === "email") {
      return;
    }

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

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
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Only JPG, PNG, and GIF images are allowed",
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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
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

    try {
      // Prepare update data
      const updateData: any = {
        name_kh: formData.name_kh,
        name_en: formData.name_en,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob,
        address: formData.address,
        department_id: parseInt(formData.department_id),
      };

      // If there's a new image, use FormData
      if (formData.image) {
        const formDataToSend = new FormData();

        // Append all fields
        Object.entries(updateData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formDataToSend.append(key, value.toString());
          }
        });

        // Append image
        formDataToSend.append("image", formData.image);

        await updateHod(hodId, formDataToSend as any);
      } else {
        // No new image, send as JSON
        await updateHod(hodId, updateData);
      }

      // Trigger success callback
      if (onSuccess) {
        onSuccess();
      }

      // Close modal
      onClose();
    } catch (error: any) {
      console.error("Error updating hod:", error);
      toast.error(error.response?.data?.message || "Failed to update hod");
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      name_kh: "",
      name_en: "",
      email: "",
      phone: "",
      gender: "",
      dob: "",
      address: "",
      department_id: "",
      image: null,
    });
    setErrors({});
    setImagePreview(null);
    setOriginalImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-white px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-[#131C2E]" />
            <h2 className="text-2xl font-bold text-gray-900">Edit Hod</h2>
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
          {isFetchingHod ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#131C2E]"></div>
              <span className="ml-3 text-gray-600">
                Loading hod data...
              </span>
            </div>
          ) : (
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
                        onError={(e) => {
                          // Fallback to a letter-based avatar if image fails to load
                          const firstLetter =
                            formData.name_en?.[0]?.toUpperCase() || "?";
                          (
                            e.target as HTMLImageElement
                          ).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Crect fill='%23e5e7eb' width='128' height='128'/%3E%3Ctext x='50%25' y='50%25' font-size='48' text-anchor='middle' dy='.3em' fill='%239ca3af'%3E${firstLetter}%3C/text%3E%3C/svg%3E`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-100 to-purple-100">
                        <User className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/jpeg,image/png,image/jpg,image/gif"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {formData.image ? "Change Photo" : "Upload New Photo"}
                </button>

                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG, GIF. Max 5MB. Leave empty to keep current photo.
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
                        errors.name_kh ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.name_kh && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.name_kh}
                      </p>
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
                        errors.name_en ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.name_en && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.name_en}
                      </p>
                    )}
                  </div>

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
                        onChange={handleInputChange}
                        placeholder="hod@example.com"
                        readOnly
                        disabled
                        className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed outline-none"
                        title="Email cannot be changed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Email address cannot be modified after registration
                    </p>
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.email}
                      </p>
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
                          errors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.phone}
                      </p>
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
                          errors.dob ? "border-red-500" : "border-gray-300"
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
                      <p className="text-sm text-red-600 mt-1">
                        {errors.gender}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter full address"
                      rows={2}
                      className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#131C2E] focus:border-[#131C2E] outline-none transition-colors ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.address && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#131C2E]" />
                  Professional Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
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
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            disabled={isLoading || isFetchingHod}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || isFetchingHod}
            className="px-6 py-2.5 bg-[#131C2E] text-white rounded-lg hover:bg-[#1B2742] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Hod"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}