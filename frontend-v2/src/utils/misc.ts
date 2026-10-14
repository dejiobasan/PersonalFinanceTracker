import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import advancedFormat from "dayjs/plugin/advancedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "react-toastify";

// Extend dayjs with duration, utc, and advancedFormat plugin
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);

export { dayjs as dayJs };

export const convertTo2Digits = (val: number | string) =>
  (!isNaN(Number(val)) ? Number(val) : 0).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

export const joinStrings = (...values: string[]) => {
  if (!values || !Array.isArray(values)) return "";
  return values
    .filter((value) => typeof value === "string" && value?.trim() !== "")
    .map((value) => value?.trim())
    .join(", ");
};

export const capitalizeStrings = (value = "") => {
  return !value || typeof value !== "string"
    ? ""
    : value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Format value as money
 * @param value
 * @param currency
 * @param hideCurrency
 * @param hideFraction
 * @returns
 */
export const formatAsMoney = (
  value: number | string,
  currency = "NGN",
  hideCurrency = false,
  hideFraction = false,
): string => {
  if (typeof value === "string" && value.includes(",")) {
    value = value.replace(/,/g, "");
  }

  return new Intl.NumberFormat("en-US", {
    ...(!hideCurrency && {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
    }),
    ...(!hideFraction && {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  }).format(!isNaN(Number(value)) ? parseFloat(value.toString()) : 0);
};

export const getAcronym = (value: string): string => {
  const words = value.trim().split(" ");
  if (words.length < 1) return "";

  const acronym = words.map((word) => word[0].toUpperCase()).join("");
  return `${acronym}`;
};

export const formatWithAcronym = (value: string): string => {
  const acronym = getAcronym(value);
  if (acronym.length <= 1) return value; // Skip if it's only one word

  return `${value} (${acronym})`;
};

/**
 *
 * @param  {...any} logs - The argument(s) to be logged
 * @returns {Function | undefined} Returns the native javascript console.log or undefined depending on the environment
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Logger = (...logs: any[]) =>
  process.env.NODE_ENV === "development"
    ? console.log(...logs, `(Log time - ${dayjs().format("LLL")})`)
    : undefined;

export const isADLogin = (username: string) =>
  username?.toLowerCase()?.includes("wemabank.com");

/**
 * Fallback for older browsers for copy to clipboard
 *
 * @param {string} text Item to be copied
 */
export const fallbackCopyTextToClipboard = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  document.body.removeChild(textArea);
};

/**
 * Copy to clipboard action
 *
 * @param {string} text Text string
 * @param {Event} event Event object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const copyToClipboard = (text: string, event?: any) => {
  const link = text || event?.getAttribute("data-clipboard-text");

  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(link);
    return;
  }
  navigator.clipboard.writeText(link);
};

/**
 * Reads a file object and returns the data URL
 *
 * @param {File} file File object to be read
 * @returns {string} Data URL
 */
export const readFileToDataUrl = (
  file: Blob,
): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });

/**
 *
 * @param {object} arguments The function arguments
 * @param {number} arguments.bytes Bytes to be converted
 * @param {number} arguments.decimals Decimal place to use
 * @returns {string} The converted bytes
 */
export const formatFileBytes = ({ bytes = 0, decimals = 2 }) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // eslint-disable-next-line no-restricted-properties
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Formats a date string into the format "10th Dec.1991".
 * @param date - The date string to format.
 * @returns The formatted date string or empty string if the input is invalid.
 */
export const formatDate = (date: string): string => {
  const parsedDate = dayjs(date);

  if (!parsedDate.isValid()) {
    return "";
  }

  return parsedDate.format("Do MMM, YYYY");
};

/**
 * Formats a date string into the time format "08:00am".
 *
 * @param {string} date - The date string to extract time from.
 * @returns {string} The formatted time string or an empty string if the input is invalid.
 */
export const formatTime = (date: string): string => {
  const parsedDate = dayjs(date);

  if (!parsedDate.isValid()) {
    return "";
  }

  return parsedDate.format("hh:mma");
};

/**
 * Formats a date string into the format "08:00 am 10th December 1991".
 *
 * @param {string} date - The date string to format.
 * @returns {string} The formatted date-time string or an empty string if the input is invalid.
 */
export const formatDateWithTime = (date: string): string => {
  const parsedDate = dayjs(date);

  if (!parsedDate.isValid()) {
    return "";
  }

  return parsedDate.format("hh:mm a Do MMMM YYYY");
};

/**
 * Safely converts any value to a trimmed string for display.
 * - If the value is a string, it trims it and returns the result (or fallback if empty).
 * - If the value is not null/undefined, it is stringified.
 * - If the value is null/undefined, it returns the fallback.
 *
 * @param val - The value to display.
 * @param fallback - The fallback string to show when the value is null, undefined, or an empty string. Defaults to "- -".
 * @returns A string safe for display.
 */
export const handleSafeStringDisplay = (val: unknown, fallback = "- -") =>
  typeof val === "string"
    ? val.trim() || fallback
    : val != null
      ? String(val)
      : fallback;

/**
 * Adds number of days to number passed.
 * - 0 → "Same day"
 * - 1 → "1 day"
 * - N (2 or more) → "N days"
 * - Invalid input → "" - empty string
 *
 * @param {number} days - The number of days
 * @returns {string} A formatted label like "Same day", "3 days", or "".
 */
export function getDayLabel(days: number): string {
  if (typeof days !== "number" || isNaN(days) || days < 0) {
    return "";
  }

  if (days === 0) return "Same day";
  if (days === 1) return "1 day";
  return `${days} days`;
}

/**
 * Formats a date range into a readable string.
 * - Single date: "10th December 2025"
 * - Same month: "10th - 15th December 2025"
 * - Different months/years: "10th December 2025 - 2nd January 2026"
 * - Invalid input: "--"
 *
 * @param start - Start date (string or Date)
 * @param end - Optional end date (string or Date)
 * @returns Formatted date range or "--" if input is invalid
 */
export const getFormattedDateRange = (
  start: string | Date,
  end?: string | Date,
): string => {
  const toDate = (val: string | Date): Date | null => {
    const d = typeof val === "string" ? new Date(val) : val;
    return isNaN(d.getTime()) ? null : d;
  };

  const getSuffix = (day: number): string => {
    if (day >= 11 && day <= 13) return "th";
    return ["st", "nd", "rd"][(day % 10) - 1] || "th";
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day}${getSuffix(day)} ${month} ${year}`;
  };

  const startDate = toDate(start);
  const endDate = end ? toDate(end) : null;

  if (!startDate) return "--";
  if (!endDate) return formatDate(startDate);

  const sameMonth = startDate.getMonth() === endDate.getMonth();
  const sameYear = startDate.getFullYear() === endDate.getFullYear();

  if (sameMonth && sameYear) {
    const startDay = `${startDate.getDate()}${getSuffix(startDate.getDate())}`;
    return `${startDay} - ${formatDate(endDate)}`;
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

/**
 * Formats a response time string like "2:3:45" into a readable form.
 * - Input: "2:3:45"
 * - Output: "2d:3hr:45m"
 *
 * Handles missing or malformed input by returning "--".
 *
 * @param timeStr - A time string in the format "days:hours:minutes"
 * @returns Formatted string like "2d:3hr:45m" or "--" if invalid
 */
export const formatResponseTime = (timeStr?: string): string => {
  if (!timeStr || typeof timeStr !== "string") return "--";

  const parts = timeStr.split(":");
  if (parts.length !== 3) return "--";

  const [days, hours, minutes] = parts.map(Number);

  if ([days, hours, minutes].some((n) => isNaN(n) || n < 0)) return "--";

  const output: string[] = [];
  if (days == 1) output.push(`${days}day`);
  if (days >= 2) output.push(`${days}days`);
  if (hours > 0) output.push(`${hours}hr`);
  if (minutes > 0) output.push(`${minutes}m`);

  return output.length > 0 ? output.join(":") : "--";
};

export const downloadFile = async (
  url: string,
  fallbackFileName = "sla-file",
) => {
  try {
    if (!url) {
      toast.error("No file URL provided");
      return;
    }
    toast.info("Downloading file...");
    const response = await fetch(url);

    if (!response.ok) toast.error("Failed to fetch file");

    const blob = await response.blob();

    // Try to extract filename from Content-Disposition header
    let fileName = fallbackFileName;
    const disposition = response.headers.get("Content-Disposition");
    if (disposition && disposition.includes("filename=")) {
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match?.[1]) {
        fileName = match[1].replace(/['"]/g, "");
      }
    } else {
      // Optional: infer extension from MIME type
      const mimeMap: Record<string, string> = {
        "application/pdf": ".pdf",
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          ".docx",
      };
      const ext = mimeMap[blob.type];
      if (ext && !fileName.endsWith(ext)) {
        fileName += ext;
      }
    }

    // Create object URL and trigger download
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    toast.dismiss();
    toast.error("Failed to download the file. Please try again.");
  }
};

/**
 * Masks an account number by replacing all characters except the last 4 with asterisks.
 * @param account - The account number to mask.
 * @returns The masked account number.
 *
 * @example
 * maskAccount("1234567890")
 * // Returns: "******7890"
 */
export const maskAccount = (account?: string | null) => {
  if (!account || typeof account !== "string") return "*** *** ****";

  const last4 = account.slice(-4);
  return `*** *** ${last4}`;
};
