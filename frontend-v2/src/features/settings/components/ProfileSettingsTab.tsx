"use client";

import { FC, useState, useRef, ChangeEvent } from "react";
import { Formik, Form } from "formik";
import {
  User,
  Mail,
  Phone,
  Camera,
  RotateCcw,
  Save,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";

import { Button, Input } from "@/components/shared";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { selectAuthUser, setAuthUser } from "@/store/slices/authSlice";
import { useUpdateProfileMutation } from "@/services";
import {
  updateProfileValidationSchema,
  UpdateProfileFormValues,
  validateAvatarFile,
  ALLOWED_AVATAR_EXTENSIONS,
} from "@/validations";
import { getErrorMessage } from "@/utils";

const getInitials = (name?: string | null): string => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const ProfileSettingsTab: FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [stagedAvatar, setStagedAvatar] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const initialValues: UpdateProfileFormValues = {
    name: user?.name ?? "",
    phoneNumber: user?.phoneNumber ?? "",
    userImage: "",
  };

  const displayAvatar = stagedAvatar || (!imageLoadError ? user?.userImage : null);

  const handleAvatarChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: unknown) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateAvatarFile(file);
    if (!validation.isValid) {
      toast.error(validation.error || "Invalid image file");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setStagedAvatar(base64String);
      setFieldValue("userImage", base64String);
    };
    reader.onerror = () => {
      toast.error("Failed to read image file. Please try another.");
    };
    reader.readAsDataURL(file);
  };

  const handleRevertAvatar = (
    setFieldValue: (field: string, value: unknown) => void,
  ) => {
    setStagedAvatar(null);
    setFieldValue("userImage", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (
    values: UpdateProfileFormValues,
    {
      setSubmitting,
      setFieldValue,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      setFieldValue: (field: string, value: unknown) => void;
    },
  ) => {
    const trimmedName = values.name.trim();
    const trimmedPhone = values.phoneNumber.trim();

    const payload: {
      name?: string;
      phoneNumber?: string;
      userImage?: string;
    } = {};

    if (trimmedName !== (user?.name ?? "")) {
      payload.name = trimmedName;
    }
    if (trimmedPhone !== (user?.phoneNumber ?? "")) {
      payload.phoneNumber = trimmedPhone;
    }
    if (values.userImage) {
      payload.userImage = values.userImage;
    }

    if (Object.keys(payload).length === 0) {
      toast.info("No profile changes detected.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await updateProfile(payload).unwrap();
      dispatch(setAuthUser(response.data));
      setStagedAvatar(null);
      setImageLoadError(false);
      setFieldValue("userImage", "");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success(response.message || "Profile updated successfully!");
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, "Failed to update profile. Please try again."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200/80">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          Personal Information
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Update your profile photo, display name, and contact phone number.
        </p>
      </div>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={updateProfileValidationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          isSubmitting,
          resetForm,
        }) => {
          const hasChanges =
            values.name.trim() !== (user?.name ?? "") ||
            values.phoneNumber.trim() !== (user?.phoneNumber ?? "") ||
            Boolean(values.userImage);

          return (
            <Form className="p-6 space-y-6" noValidate>
              {/* Avatar Upload Section */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                <div className="relative w-20 h-20 shrink-0">
                  {displayAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={displayAvatar}
                      alt={user?.name || "Profile Avatar"}
                      onError={() => setImageLoadError(true)}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold ring-4 ring-white shadow-md">
                      {getInitials(values.name || user?.name)}
                    </div>
                  )}

                  <label
                    htmlFor="profile-avatar-upload"
                    title="Upload new photo"
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center ring-2 ring-white shadow-sm cursor-pointer transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </label>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      Profile Photo
                    </h4>
                    {stagedAvatar && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        <CheckCircle2 className="w-3 h-3" />
                        New photo staged
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Allowed formats: PNG, JPG, JPEG, or HEIC. Maximum file size
                    is 5MB.
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2.5">
                    <label
                      htmlFor="profile-avatar-upload"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white border border-slate-200 hover:border-blue-300 shadow-2xs hover:bg-blue-50/50 transition-all cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{displayAvatar ? "Change Photo" : "Upload Photo"}</span>
                    </label>

                    {stagedAvatar && (
                      <button
                        type="button"
                        onClick={() => handleRevertAvatar(setFieldValue)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Photo</span>
                      </button>
                    )}

                    <input
                      ref={fileInputRef}
                      id="profile-avatar-upload"
                      type="file"
                      accept={ALLOWED_AVATAR_EXTENSIONS.join(",")}
                      onChange={(e) => handleAvatarChange(e, setFieldValue)}
                      className="sr-only"
                    />
                  </div>
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  label="Full Name"
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                  leftIcon={<User className="w-4 h-4 sm:w-5 sm:h-5" />}
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && errors.name ? errors.name : undefined}
                />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  value={user?.email ?? ""}
                  disabled
                  leftIcon={<Mail className="w-4 h-4 sm:w-5 sm:h-5" />}
                  helperText="Email address is linked to your account and cannot be changed."
                />

                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  label="Phone Number"
                  placeholder="1234567890"
                  required
                  autoComplete="tel"
                  leftIcon={<Phone className="w-4 h-4 sm:w-5 sm:h-5" />}
                  value={values.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.phoneNumber && errors.phoneNumber
                      ? errors.phoneNumber
                      : undefined
                  }
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={!hasChanges || isSubmitting || isLoading}
                  onClick={() => {
                    resetForm();
                    handleRevertAvatar(setFieldValue);
                  }}
                  className="!text-slate-600 hover:!text-slate-900 hover:!bg-slate-100"
                >
                  Discard Changes
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!hasChanges}
                  isLoading={isSubmitting || isLoading}
                  loadingText="Saving..."
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save Changes
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ProfileSettingsTab;

