import { Theme } from "../types";

interface LoadingSpinnerProps {
  theme?: Theme;
}

export const LoadingSpinner = ({ theme }: LoadingSpinnerProps) => (
  <div
    className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
      theme === "dark" ? "bg-gray-900" : "bg-white"
    }`}
  >
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p
        className={`mt-4 ${
          theme === "dark" ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Loading...
      </p>
    </div>
  </div>
);
