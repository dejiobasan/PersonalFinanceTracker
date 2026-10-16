"use client";

import { FC, useState, useRef, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Camera,
  Trash2,
  Sparkles,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";

import { APP_PATHS } from "@/constants";
import { useAppDispatch } from "@/store/hook";
import { setLoading, setUserVerification } from "@/store";
import { useRegisterUserMutation } from "@/services";
import { Button, Input } from "@/components/shared";
import {
  registerValidationSchema,
  RegisterFormValues,
  validateAvatarFile,
  ALLOWED_AVATAR_EXTENSIONS,
} from "@/validations";
import { getErrorMessage } from "@/utils";

const initialValues: RegisterFormValues = {
  name: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  userImage: "",
};

export const SignUp: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      setAvatarPreview(base64String);
      setFieldValue("userImage", base64String);
    };
    reader.onerror = () => {
      toast.error("Failed to read image file. Please try another.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = (
    setFieldValue: (field: string, value: unknown) => void,
  ) => {
    setAvatarPreview(null);
    setFieldValue("userImage", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      dispatch(
        setLoading({ isLoading: true, text: "Creating your account..." }),
      );

      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        phoneNumber: values.phoneNumber.trim(),
        userImage: values.userImage || undefined,
      };

      const response = await registerUser(payload).unwrap();

      dispatch(
        setUserVerification({
          userVerificationEmail: values.email.trim(),
          userVerificationType: "email_verification",
        }),
      );

      toast.success(
        response.message ||
          "Account created! Check your email for your 6-digit verification code.",
      );

      router.push(APP_PATHS.VERIFY_OTP);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(
        err,
        "Registration failed. Please check your information and try again.",
      );
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-full">
      {/* Header / Intro */}
      <div className="mb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 mb-2 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Get Started Free</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create your account
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Join thousands tracking their wealth and achieving financial freedom.
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={registerValidationSchema}
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
        }) => {
          const hasLength = values.password.length >= 8;
          const hasLetter = /[A-Za-z]/.test(values.password);
          const hasNumber = /\d/.test(values.password);

          return (
            <Form
              className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3 sm:gap-y-3.5"
              noValidate
            >
              {/* Row 1, Col 1: Full Name */}
              <div className="md:col-span-1">
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
              </div>

              {/* Row 1, Col 2: Email Address */}
              <div className="md:col-span-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  leftIcon={<Mail className="w-4 h-4 sm:w-5 sm:h-5" />}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.email && errors.email ? errors.email : undefined
                  }
                />
              </div>

              {/* Row 2, Col 1: Phone Number */}
              <div className="md:col-span-1">
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

              {/* Row 2, Col 2: Profile Photo (44px height container matching inputs) */}
              <div className="md:col-span-1 flex flex-col justify-start">
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Profile Photo{" "}
                  <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="h-11 px-3 bg-slate-50 border border-slate-200/90 rounded-xl flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {avatarPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-500/30 shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center shrink-0">
                        <Camera className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <span className="text-xs text-slate-500 truncate">
                      {avatarPreview ? "Photo selected" : "PNG, JPG, HEIC"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAvatar(setFieldValue)}
                        title="Remove photo"
                        className="text-[11px] text-rose-600 hover:text-rose-700 p-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <label
                      htmlFor="userImageFile"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white border border-slate-200 hover:border-blue-200 px-2.5 py-1 rounded-lg cursor-pointer shadow-2xs hover:bg-blue-50/60 transition-all"
                    >
                      {avatarPreview ? "Change" : "Upload"}
                    </label>
                  </div>
                  <input
                    ref={fileInputRef}
                    id="userImageFile"
                    type="file"
                    accept={ALLOWED_AVATAR_EXTENSIONS.join(",")}
                    onChange={(e) => handleAvatarChange(e, setFieldValue)}
                    className="sr-only"
                  />
                </div>
              </div>

              {/* Row 3, Col 1: Password */}
              <div className="md:col-span-1">
                <Input
                  id="password"
                  name="password"
                  label="Password"
                  placeholder="••••••••"
                  isPassword
                  required
                  autoComplete="new-password"
                  leftIcon={<Lock className="w-4 h-4 sm:w-5 sm:h-5" />}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.password && errors.password
                      ? errors.password
                      : undefined
                  }
                />
                {/* Compact Password Requirement Pills */}
                {values.password && (
                  <div className="grid grid-cols-3 gap-1 text-[10px] sm:text-[11px] pt-1">
                    <div
                      className={`flex items-center gap-0.5 font-medium transition-colors ${
                        hasLength ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>8+ chars</span>
                    </div>
                    <div
                      className={`flex items-center gap-0.5 font-medium transition-colors ${
                        hasLetter ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>1+ letter</span>
                    </div>
                    <div
                      className={`flex items-center gap-0.5 font-medium transition-colors ${
                        hasNumber ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>1+ number</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Row 3, Col 2: Confirm Password */}
              <div className="md:col-span-1">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="••••••••"
                  isPassword
                  required
                  autoComplete="new-password"
                  leftIcon={<Lock className="w-4 h-4 sm:w-5 sm:h-5" />}
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.confirmPassword && errors.confirmPassword
                      ? errors.confirmPassword
                      : undefined
                  }
                />
              </div>

              {/* Submit CTA (Full width across 2 cols) */}
              <div className="md:col-span-2 pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting || isLoading}
                  loadingText="Creating account..."
                  rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                  className="cursor-pointer"
                >
                  Create Account
                </Button>
              </div>

              {/* Existing user prompt */}
              <p className="md:col-span-2 text-center text-xs sm:text-sm text-slate-500 pt-0.5">
                Already have an account?{" "}
                <Link
                  href={APP_PATHS.LOGIN}
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
                >
                  Sign in
                </Link>
              </p>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default SignUp;
