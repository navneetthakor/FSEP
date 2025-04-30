import React from "react";
import { Loader2 } from "lucide-react";

/**
 * PopupLoader component that displays a centered loading spinner
 * 
 * @param {Object} props
 * @param {boolean} props.isLoading - Controls whether the loader is visible
 * @param {string} props.text - Optional text to display under the loader
 * @param {number} props.size - Size of the spinner in pixels (default: 40)
 * @param {string} props.color - Color of the spinner (default: "text-primary")
 * @param {string} props.backdropClass - Additional classes for the backdrop
 */
const PopupLoader = ({
  isLoading = false,
  text = "Loading...",
  size = 40,
  color = "text-primary",
  backdropClass = "",
}) => {
  if (!isLoading) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${backdropClass}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl flex flex-col items-center">
        <Loader2 
          className={`${color} animate-spin`} 
          size={size} 
        />
        {text && (
          <p className="mt-4 text-gray-700 dark:text-gray-300 text-sm font-medium">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default PopupLoader;