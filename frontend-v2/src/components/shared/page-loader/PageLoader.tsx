"use client";

import { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector } from "@/store/hook";
import { selectIsLoading, selectLoadingText } from "@/store/slices/loadingSlice";
import { Loader2, Sparkles } from "lucide-react";

export interface PageLoaderProps {
  /** Optional manual text override. If not provided, text from Redux state is used. */
  text?: string;
  /** Optional custom class name for the wrapper */
  className?: string;
}

export const PageLoader: FC<PageLoaderProps> = ({ text: propText, className = "" }) => {
  const isLoading = useAppSelector(selectIsLoading);
  const stateText = useAppSelector(selectLoadingText);

  const displayText = propText ?? stateText ?? "Processing, please wait...";

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="global-page-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label={displayText}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md select-none ${className}`}
        >
          {/* Ambient Glow */}
          <div className="absolute w-72 h-72 rounded-full bg-blue-600/20 blur-3xl pointer-events-none animate-pulse" />

          {/* Loader Card */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center gap-5 px-8 py-7 rounded-2xl bg-slate-900/85 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(59,130,246,0.18)] max-w-sm w-full text-center overflow-hidden"
          >
            {/* Top decorative gradient line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-80" />

            {/* Spinner Container */}
            <div className="relative flex items-center justify-center w-20 h-20">
              {/* Outer soft pulsing ring */}
              <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ping opacity-35" />

              {/* Counter-rotating track */}
              <div className="absolute inset-1 rounded-full border-2 border-dashed border-blue-400/25 animate-[spin_8s_linear_infinite]" />

              {/* Main glowing gradient spinner */}
              <div className="absolute inset-1 rounded-full border-[3px] border-transparent border-t-blue-500 border-r-indigo-400 animate-spin" />

              {/* Inner glowing core with icon */}
              <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 text-blue-100" />
                </motion.div>
              </div>
            </div>

            {/* Loading text with animated dots */}
            <div className="flex flex-col items-center gap-1.5">
              <p className="text-base font-semibold text-white tracking-wide">
                {displayText}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
