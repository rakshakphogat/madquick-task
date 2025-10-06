import { AuthForm, AuthMode, Theme } from "../types";

interface AuthenticationViewProps {
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  authForm: AuthForm;
  setAuthForm: (form: AuthForm) => void;
  authError: string;
  setAuthError: (error: string) => void;
  requires2FA: boolean;
  setRequires2FA: (requires: boolean) => void;
  handleAuth: (e: React.FormEvent) => void;
  theme?: Theme;
}

export const AuthenticationView = ({
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  authError,
  setAuthError,
  requires2FA,
  setRequires2FA,
  handleAuth,
  theme,
}: AuthenticationViewProps) => (
  <div
    className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
      theme === "dark" ? "bg-gray-900" : "bg-gray-50"
    }`}
  >
    <div
      className={`max-w-md w-full p-6 rounded-lg shadow ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="text-center mb-6">
        <h1
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Password Manager
        </h1>
        <p
          className={`mt-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Secure Password Generator + Vault
        </p>
      </div>

      <div className="flex mb-4">
        <button
          onClick={() => {
            setAuthMode("login");
            setRequires2FA(false);
            setAuthError("");
          }}
          className={`flex-1 py-2 cursor-pointer text-center border ${
            authMode === "login" ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          Login
        </button>

        <button
          onClick={() => {
            setAuthMode("signup");
            setRequires2FA(false);
            setAuthError("");
          }}
          className={`flex-1 py-2 text-center cursor-pointer border ${
            authMode === "signup"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        {authError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {authError}
          </div>
        )}

        {authMode === "signup" && (
          <input
            type="text"
            placeholder="Name"
            value={authForm.name}
            onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              theme === "dark"
                ? "text-white bg-gray-700 border-gray-600 placeholder-gray-400"
                : "text-black bg-white placeholder-gray-500"
            }`}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={authForm.email}
          onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            theme === "dark"
              ? "text-white bg-gray-700 border-gray-600 placeholder-gray-400"
              : "text-black bg-white placeholder-gray-500"
          }`}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={authForm.password}
          onChange={(e) =>
            setAuthForm({ ...authForm, password: e.target.value })
          }
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            theme === "dark"
              ? "text-white bg-gray-700 border-gray-600 placeholder-gray-400"
              : "text-black bg-white placeholder-gray-500"
          }`}
          required
        />

        {(requires2FA || authForm.totpToken) && (
          <input
            type="text"
            placeholder="2FA Code (6 digits)"
            value={authForm.totpToken}
            onChange={(e) =>
              setAuthForm({ ...authForm, totpToken: e.target.value })
            }
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              theme === "dark"
                ? "text-white bg-gray-700 border-gray-600 placeholder-gray-400"
                : "text-black bg-white placeholder-gray-500"
            }`}
            maxLength={6}
          />
        )}

        <button
          type="submit"
          className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          {authMode === "login" ? "Login" : "Sign Up"}
        </button>
      </form>
    </div>
  </div>
);
