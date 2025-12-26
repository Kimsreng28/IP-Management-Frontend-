"use client";

import { useEffect, useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { useHodStore } from "../../../stores/useHodStore";

interface HodDetailProps {
  hodId: string;
  isOpen: boolean;
  onClose: () => void;
}



export default function HodViewDetail({
  hodId,
  isOpen,
  onClose,
}: HodDetailProps) {
  const [hod, setHod] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fetchHodById } = useHodStore();

  useEffect(() => {
    if (isOpen && hodId) {
      fetchHodDetail();
    }
  }, [isOpen, hodId]);

  const fetchHodDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const hodData = await fetchHodById(hodId);

      if (hodData) {
        setHod(hodData);
      } else {
        setError("Failed to fetch hod details");
      }
    } catch (err) {
      setError("Failed to load hod details");
      console.error("Error fetching hod:", err);
    } finally {
      setIsLoading(false);
    }
  };

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-white px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Hod Detail</h2>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#131C2E]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">{error}</p>
              <button
                onClick={fetchHodDetail}
                className="mt-4 px-6 py-2 bg-[#131C2E] text-white rounded-lg hover:bg-[#1B2742]"
              >
                Try Again
              </button>
            </div>
          ) : hod ? (
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Profile Image */}
                <div className="shrink-0">
                  <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-200 border-4 border-gray-100 shadow-lg">
                    {getImageUrl(hod.image) ? (
                      <img
                        src={getImageUrl(hod.image)!}
                        alt={hod.name_en}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder on error
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Crect fill='%23e5e7eb' width='128' height='128'/%3E%3Ctext x='50%25' y='50%25' font-size='48' text-anchor='middle' dy='.3em' fill='%239ca3af'%3E" +
                            (hod.name_en?.[0]?.toUpperCase() || "?") +
                            "%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      // Default avatar with first letter
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-500 to-purple-600">
                        <span className="text-4xl font-bold text-white">
                          {hod.name_en?.[0]?.toUpperCase() || "?"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {hod.name_kh}
                    </h3>
                    <p className="text-xl text-gray-600 mt-1">
                      {hod.name_en}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#131C2E] text-white">
                      {hod.hod_id}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        hod.gender === "Male"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-pink-100 text-pink-800"
                      }`}
                    >
                      {hod.gender}
                    </span>
                  </div>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#131C2E]" />
                    Personal Information
                  </h4>

                  <div className="space-y-3">
                    {hod.dob && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Date of Birth</p>
                          <p className="text-base font-medium text-gray-900">
                            {formatDate(hod.dob)} (
                            {calculateAge(hod.dob)} years old)
                          </p>
                        </div>
                      </div>
                    )}

                    {hod.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-base font-medium text-gray-900">
                            {hod.email}
                          </p>
                        </div>
                      </div>
                    )}

                    {hod.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="text-base font-medium text-gray-900">
                            {hod.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    {hod.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="text-base font-medium text-gray-900">
                            {hod.address}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#131C2E]" />
                    Professional Information
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <GraduationCap className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="text-base font-medium text-gray-900">
                          {hod.department}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              {hod.created_at && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Created:</span>{" "}
                      {formatDate(hod.created_at)}
                    </div>
                    {hod.updated_at && (
                      <div>
                        <span className="font-medium">Last Updated:</span>{" "}
                        {formatDate(hod.updated_at)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}