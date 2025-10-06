import { Theme, User, ViewType } from "../types";

interface HeaderProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  user: User | null;
  handleLogout: () => void;
  theme: Theme;
  toggleTheme: () => void;
}

export const Header = ({
  currentView,
  setCurrentView,
  user,
  handleLogout,
  theme,
  toggleTheme,
}: HeaderProps) => (
  <header className={`shadow ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => setCurrentView("generator")}
            className={`px-4 cursor-pointer py-2 rounded border ${
              currentView === "generator"
                ? "bg-black text-white"
                : theme === "dark"
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black"
            }`}
          >
            🔑 Generator
          </button>

          <button
            onClick={() => setCurrentView("vault")}
            className={`px-4 cursor-pointer py-2 rounded border ${
              currentView === "vault"
                ? "bg-black text-white"
                : theme === "dark"
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black"
            }`}
          >
            🔒 Vault
          </button>

          <button
            onClick={() => setCurrentView("settings")}
            className={`px-4 cursor-pointer py-2 rounded border ${
              currentView === "settings"
                ? "bg-black text-white"
                : theme === "dark"
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black"
            }`}
          >
            ⚙️ Settings
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-md transition-colors cursor-pointer ${
              theme === "dark"
                ? "hover:bg-gray-700 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <span
            className={theme === "dark" ? "text-gray-200" : "text-gray-700"}
          >
            Welcome, {user?.name}!
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
);
