import * as yup from "yup";

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = yup.InferType<typeof loginValidationSchema>;

export const verifyOtpValidationSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  otp: yup
    .string()
    .trim()
    .required("Verification code is required")
    .matches(/^\d{6}$/, "Verification code must be exactly 6 digits"),
});

export type VerifyOtpFormValues = yup.InferType<
  typeof verifyOtpValidationSchema
>;

export const registerValidationSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .required("Full name is required"),
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  phoneNumber: yup
    .string()
    .trim()
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .required("Phone number is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password cannot exceed 128 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      "Password must contain at least one letter and one number",
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
  userImage: yup.string().optional(),
});

export type RegisterFormValues = yup.InferType<
  typeof registerValidationSchema
>;

export const forgotPasswordValidationSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email address is required"),
});

export type ForgotPasswordFormValues = yup.InferType<
  typeof forgotPasswordValidationSchema
>;

export const resetPasswordValidationSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  otp: yup
    .string()
    .trim()
    .required("Verification code is required")
    .matches(/^\d{6}$/, "Verification code must be exactly 6 digits"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password cannot exceed 128 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      "Password must contain at least one letter and one number",
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

export type ResetPasswordFormValues = yup.InferType<
  typeof resetPasswordValidationSchema
>;

export const updateProfileValidationSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .required("Full name is required"),
  phoneNumber: yup
    .string()
    .trim()
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .required("Phone number is required"),
  userImage: yup.string().optional(),
});

export type UpdateProfileFormValues = yup.InferType<
  typeof updateProfileValidationSchema
>;

export const changePasswordValidationSchema = yup.object().shape({
  oldPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "New password must be at least 8 characters")
    .max(128, "New password cannot exceed 128 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      "New password must contain at least one letter and one number",
    )
    .notOneOf(
      [yup.ref("oldPassword")],
      "New password must be different from your current password",
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

export type ChangePasswordFormValues = yup.InferType<
  typeof changePasswordValidationSchema
>;

export const transactionValidationSchema = yup.object().shape({
  description: yup
    .string()
    .trim()
    .min(2, "Description must be at least 2 characters")
    .max(255, "Description cannot exceed 255 characters")
    .required("Description is required"),
  amount: yup
    .number()
    .typeError("Please enter a valid numeric amount")
    .positive("Amount must be greater than 0")
    .test(
      "max-decimals",
      "Amount can have at most 2 decimal places",
      (val) =>
        val === undefined ||
        val === null ||
        /^\d+(\.\d{1,2})?$/.test(String(val)),
    )
    .required("Amount is required"),
  type: yup
    .mixed<"CREDIT" | "DEBIT">()
    .oneOf(["CREDIT", "DEBIT"], "Please select a valid transaction type")
    .required("Transaction type is required"),
});

export type TransactionFormValues = yup.InferType<
  typeof transactionValidationSchema
>;

/** Allowed extensions and MIME types for user avatars */
export const ALLOWED_AVATAR_EXTENSIONS = [".png", ".jpg", ".jpeg", ".heic"];
export const ALLOWED_AVATAR_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/heic",
  "image/heif",
];
export const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface AvatarValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateAvatarFile = (file: File): AvatarValidationResult => {
  const extension = "." + file.name.split(".").pop()?.toLowerCase();
  const mimeType = file.type.toLowerCase();

  const isExtensionValid = ALLOWED_AVATAR_EXTENSIONS.includes(extension);
  const isMimeValid =
    ALLOWED_AVATAR_MIME_TYPES.includes(mimeType) ||
    extension === ".heic" ||
    extension === ".heif";

  if (!isExtensionValid && !isMimeValid) {
    return {
      isValid: false,
      error: "Only PNG, JPG, JPEG, and HEIC image files are allowed.",
    };
  }

  if (file.size > MAX_AVATAR_SIZE_BYTES) {
    return {
      isValid: false,
      error: "Image size exceeds 5MB limit. Please choose a smaller photo.",
    };
  }

  return { isValid: true };
};
