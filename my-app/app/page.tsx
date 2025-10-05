"use client";

import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";

// Types
interface User {
  id: string;
  name: string;
  email: string;
}

interface VaultItem {
  _id: string;
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  createdAt: string;
}

interface PasswordOptions {
  length: number;
  includeNumbers: boolean;
  includeLetters: boolean;
  includeSymbols: boolean;
  excludeLookAlikes: boolean;
}

// Encryption functions
const ENCRYPTION_KEY = "user-master-key"; // In real app, derive from user password

const encryptData = (text: string): string => {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

const decryptData = (encryptedText: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Password generator function
const generatePassword = (options: PasswordOptions): string => {
  const numbers = "0123456789";
  const lettersLower = "abcdefghijklmnopqrstuvwxyz";
  const lettersUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const lookAlikes = "il1Lo0O";

  let charset = "";

  if (options.includeNumbers) charset += numbers;
  if (options.includeLetters) charset += lettersLower + lettersUpper;
  if (options.includeSymbols) charset += symbols;

  if (options.excludeLookAlikes) {
    for (const char of lookAlikes) {
      charset = charset.replace(new RegExp(char, "g"), "");
    }
  }

  if (!charset) return "";

  let password = "";
  for (let i = 0; i < options.length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// ========== COMPONENTS ==========

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

// Authentication Component
const AuthenticationView = ({
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  authError,
  handleAuth,
}: {
  authMode: "login" | "signup";
  setAuthMode: (mode: "login" | "signup") => void;
  authForm: { name: string; email: string; password: string };
  setAuthForm: (form: {
    name: string;
    email: string;
    password: string;
  }) => void;
  authError: string;
  handleAuth: (e: React.FormEvent) => void;
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Password Manager</h1>
        <p className="text-gray-600 mt-2">Secure Password Generator + Vault</p>
      </div>

      <div className="flex mb-4">
        <button
          onClick={() => setAuthMode("login")}
          className={`flex-1 py-2 cursor-pointer text-center border ${
            authMode === "login" ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          Login
        </button>

        <button
          onClick={() => setAuthMode("signup")}
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
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={authForm.email}
          onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
          className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={authForm.password}
          onChange={(e) =>
            setAuthForm({ ...authForm, password: e.target.value })
          }
          className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />

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

// Header Component
const Header = ({
  currentView,
  setCurrentView,
  user,
  handleLogout,
}: {
  currentView: "auth" | "generator" | "vault";
  setCurrentView: (view: "auth" | "generator" | "vault") => void;
  user: User | null;
  handleLogout: () => void;
}) => (
  <header className="bg-white shadow">
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => setCurrentView("generator")}
            className={`px-4 cursor-pointer py-2 rounded border ${
              currentView === "generator"
                ? "bg-black text-white"
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
                : "bg-white text-black"
            }`}
          >
            🔒 Vault
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Welcome, {user?.name}!</span>
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

// Password Generator Component
const PasswordGeneratorView = ({
  passwordOptions,
  setPasswordOptions,
  generatedPassword,
  setGeneratedPassword,
  onCopyPassword,
}: {
  passwordOptions: PasswordOptions;
  setPasswordOptions: (options: PasswordOptions) => void;
  generatedPassword: string;
  setGeneratedPassword: (password: string) => void;
  onCopyPassword: (password: string) => void;
}) => (
  <div className="max-w-2xl mx-auto text-black">
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Password Generator</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Length: {passwordOptions.length}
          </label>
          <input
            type="range"
            min="4"
            max="50"
            value={passwordOptions.length}
            onChange={(e) =>
              setPasswordOptions({
                ...passwordOptions,
                length: parseInt(e.target.value),
              })
            }
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={passwordOptions.includeNumbers}
              onChange={(e) =>
                setPasswordOptions({
                  ...passwordOptions,
                  includeNumbers: e.target.checked,
                })
              }
              className="mr-2"
            />
            Include Numbers
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={passwordOptions.includeLetters}
              onChange={(e) =>
                setPasswordOptions({
                  ...passwordOptions,
                  includeLetters: e.target.checked,
                })
              }
              className="mr-2"
            />
            Include Letters
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={passwordOptions.includeSymbols}
              onChange={(e) =>
                setPasswordOptions({
                  ...passwordOptions,
                  includeSymbols: e.target.checked,
                })
              }
              className="mr-2"
            />
            Include Symbols
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={passwordOptions.excludeLookAlikes}
              onChange={(e) =>
                setPasswordOptions({
                  ...passwordOptions,
                  excludeLookAlikes: e.target.checked,
                })
              }
              className="mr-2"
            />
            Exclude Look-alikes
          </label>
        </div>

        <button
          onClick={() =>
            setGeneratedPassword(generatePassword(passwordOptions))
          }
          className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Generate Password
        </button>

        {generatedPassword && (
          <div className="bg-gray-100 p-4 rounded">
            <div className="flex items-center justify-between">
              <code className="text-lg font-mono break-all">
                {generatedPassword}
              </code>
              <button
                onClick={() => onCopyPassword(generatedPassword)}
                className="ml-2 cursor-pointer bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Password will be cleared from clipboard in 15 seconds
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Vault Form Component
const VaultFormComponent = ({
  editingItem,
  vaultForm,
  setVaultForm,
  handleVaultSubmit,
  setShowForm,
}: {
  editingItem: VaultItem | null;
  vaultForm: {
    title: string;
    username: string;
    password: string;
    url: string;
    notes: string;
  };
  setVaultForm: (form: {
    title: string;
    username: string;
    password: string;
    url: string;
    notes: string;
  }) => void;
  handleVaultSubmit: (e: React.FormEvent) => void;
  setShowForm: (show: boolean) => void;
}) => (
  <div className="bg-white text-black rounded-lg shadow p-6 mb-6">
    <h3 className="text-lg font-bold mb-4">
      {editingItem ? "Edit Item" : "Add New Item"}
    </h3>
    <form onSubmit={handleVaultSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={vaultForm.title}
        onChange={(e) => setVaultForm({ ...vaultForm, title: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        required
      />
      <input
        type="text"
        placeholder="Username"
        value={vaultForm.username}
        onChange={(e) =>
          setVaultForm({ ...vaultForm, username: e.target.value })
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={vaultForm.password}
        onChange={(e) =>
          setVaultForm({ ...vaultForm, password: e.target.value })
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        required
      />
      <input
        type="url"
        placeholder="URL (optional)"
        value={vaultForm.url}
        onChange={(e) => setVaultForm({ ...vaultForm, url: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />
      <textarea
        placeholder="Notes (optional)"
        value={vaultForm.notes}
        onChange={(e) => setVaultForm({ ...vaultForm, notes: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        rows={3}
      />
      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {editingItem ? "Update" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="bg-gray-300 cursor-pointer hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
);

// Vault Item Component
const VaultItemComponent = ({
  item,
  onEdit,
  onDelete,
  onCopyPassword,
}: {
  item: VaultItem;
  onEdit: (item: VaultItem) => void;
  onDelete: (id: string) => void;
  onCopyPassword: (password: string) => void;
}) => (
  <div className="bg-white rounded-lg text-black shadow p-6">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <p className="text-gray-600">Username: {item.username}</p>
        {item.url && (
          <p className="text-blue-600">
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.url}
            </a>
          </p>
        )}
        {item.notes && <p className="text-gray-500 mt-2">{item.notes}</p>}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onCopyPassword(item.password)}
          className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
        >
          Copy Password
        </button>
        <button
          onClick={() => onEdit(item)}
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item._id)}
          className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// Vault View Component
const VaultView = ({
  vaultItems,
  searchTerm,
  setSearchTerm,
  showForm,
  setShowForm,
  editingItem,
  setEditingItem,
  vaultForm,
  setVaultForm,
  handleVaultSubmit,
  handleDelete,
  onCopyPassword,
}: {
  vaultItems: VaultItem[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  editingItem: VaultItem | null;
  setEditingItem: (item: VaultItem | null) => void;
  vaultForm: {
    title: string;
    username: string;
    password: string;
    url: string;
    notes: string;
  };
  setVaultForm: (form: {
    title: string;
    username: string;
    password: string;
    url: string;
    notes: string;
  }) => void;
  handleVaultSubmit: (e: React.FormEvent) => void;
  handleDelete: (id: string) => void;
  onCopyPassword: (password: string) => void;
}) => {
  const filteredVaultItems = vaultItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (item: VaultItem) => {
    setEditingItem(item);
    setVaultForm({
      title: item.title,
      username: item.username,
      password: item.password,
      url: item.url,
      notes: item.notes,
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 text-black">
        <h2 className="text-2xl font-bold">Password Vault</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingItem(null);
            setVaultForm({
              title: "",
              username: "",
              password: "",
              url: "",
              notes: "",
            });
          }}
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add New
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search vault items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <VaultFormComponent
          editingItem={editingItem}
          vaultForm={vaultForm}
          setVaultForm={setVaultForm}
          handleVaultSubmit={handleVaultSubmit}
          setShowForm={setShowForm}
        />
      )}

      {/* Vault Items */}
      <div className="space-y-4">
        {filteredVaultItems.map((item) => (
          <VaultItemComponent
            key={item._id}
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCopyPassword={onCopyPassword}
          />
        ))}

        {filteredVaultItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm
              ? "No items found matching your search."
              : "No vault items yet. Add your first one!"}
          </div>
        )}
      </div>
    </div>
  );
};

export default function PasswordManager() {
  // App state
  const [currentView, setCurrentView] = useState<
    "auth" | "generator" | "vault"
  >("auth");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth state
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [authError, setAuthError] = useState("");

  // Password generator state
  const [passwordOptions, setPasswordOptions] = useState<PasswordOptions>({
    length: 12,
    includeNumbers: true,
    includeLetters: true,
    includeSymbols: true,
    excludeLookAlikes: false,
  });
  const [generatedPassword, setGeneratedPassword] = useState("");

  // Vault state
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });
  const [vaultForm, setVaultForm] = useState({
    title: "",
    username: "",
    password: "",
    url: "",
    notes: "",
  });

  // Enhanced clipboard functionality with fallbacks and optimization
  const copyToClipboard = async (text: string, clearAfter: number = 15) => {
    try {
      // Fast path: Use modern clipboard API if available and secure context
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);

          // Show success feedback immediately
          setCopyFeedback({ show: true, message: "Copied to clipboard!" });
          setTimeout(() => setCopyFeedback({ show: false, message: "" }), 2000);

          // Optimized auto-clear - only set if needed
          if (clearAfter > 0) {
            setTimeout(() => {
              navigator.clipboard.writeText("").catch(() => {
                // Silently fail if clearing fails
              });
            }, clearAfter * 1000);
          }
          return true;
        } catch (clipboardError) {
          // Permission might be denied, fall through to legacy method
          console.warn(
            "Modern clipboard API failed, using fallback:",
            clipboardError
          );
        }
      }

      // Fallback to legacy method for better compatibility
      return fallbackCopyToClipboard(text, clearAfter);
    } catch (error) {
      console.warn("Clipboard write failed, using fallback:", error);
      return fallbackCopyToClipboard(text, clearAfter);
    }
  };

  // Fallback clipboard method using execCommand (faster and more compatible)
  const fallbackCopyToClipboard = (
    text: string,
    clearAfter: number = 15
  ): boolean => {
    try {
      // Create a temporary textarea element
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      textArea.setAttribute("readonly", "");

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      // Use execCommand for immediate copy
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        // Show success feedback
        setCopyFeedback({ show: true, message: "Copied to clipboard!" });
        setTimeout(() => setCopyFeedback({ show: false, message: "" }), 2000);

        // Auto-clear functionality for fallback
        if (clearAfter > 0) {
          setTimeout(() => {
            // Try to clear using modern API first, then fallback
            if (navigator.clipboard && window.isSecureContext) {
              navigator.clipboard.writeText("").catch(() => {
                // If modern API fails, use fallback clear
                fallbackClearClipboard();
              });
            } else {
              fallbackClearClipboard();
            }
          }, clearAfter * 1000);
        }
      } else {
        // Show error feedback
        setCopyFeedback({ show: true, message: "Failed to copy to clipboard" });
        setTimeout(() => setCopyFeedback({ show: false, message: "" }), 3000);
      }

      return successful;
    } catch (error) {
      console.error("Fallback copy failed:", error);
      setCopyFeedback({
        show: true,
        message: "Copy failed - please copy manually",
      });
      setTimeout(() => setCopyFeedback({ show: false, message: "" }), 3000);
      return false;
    }
  };

  // Fallback method to clear clipboard
  const fallbackClearClipboard = () => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = "";
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";

      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    } catch {
      // Silently fail - clearing is not critical
    }
  };

  // Check authentication on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
            setCurrentView("generator");
            loadVaultItems();
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const url = authMode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const payload =
      authMode === "login"
        ? { email: authForm.email, password: authForm.password }
        : authForm;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setCurrentView("generator");
        loadVaultItems();
      } else {
        setAuthError(data.message);
      }
    } catch {
      setAuthError("Something went wrong. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      console.error("Logout error");
    }
    setUser(null);
    setCurrentView("auth");
    setVaultItems([]);
  };

  const loadVaultItems = async () => {
    try {
      const response = await fetch("/api/vault", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Decrypt passwords for display
          const decryptedItems = data.data.map((item: VaultItem) => ({
            ...item,
            password: decryptData(item.password),
          }));
          setVaultItems(decryptedItems);
        }
      }
    } catch (error) {
      console.error("Load vault items failed:", error);
    }
  };

  const handleVaultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Encrypt password before sending
    const encryptedItem = {
      ...vaultForm,
      password: encryptData(vaultForm.password),
    };

    const url = editingItem ? `/api/vault/${editingItem._id}` : "/api/vault";

    const method = editingItem ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(encryptedItem),
      });

      if (response.ok) {
        loadVaultItems();
        setShowForm(false);
        setEditingItem(null);
        setVaultForm({
          title: "",
          username: "",
          password: "",
          url: "",
          notes: "",
        });
      }
    } catch (error) {
      console.error("Vault operation failed:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/vault/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        loadVaultItems();
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // Render loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Render authentication view
  if (currentView === "auth") {
    return (
      <AuthenticationView
        authMode={authMode}
        setAuthMode={setAuthMode}
        authForm={authForm}
        setAuthForm={setAuthForm}
        authError={authError}
        handleAuth={handleAuth}
      />
    );
  }

  // Render main app with header and content
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Copy feedback notification */}
      {copyFeedback.show && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-lg transition-all duration-300">
          {copyFeedback.message}
        </div>
      )}

      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        handleLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === "generator" && (
          <PasswordGeneratorView
            passwordOptions={passwordOptions}
            setPasswordOptions={setPasswordOptions}
            generatedPassword={generatedPassword}
            setGeneratedPassword={setGeneratedPassword}
            onCopyPassword={(password) => copyToClipboard(password, 15)}
          />
        )}

        {currentView === "vault" && (
          <VaultView
            vaultItems={vaultItems}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showForm={showForm}
            setShowForm={setShowForm}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            vaultForm={vaultForm}
            setVaultForm={setVaultForm}
            handleVaultSubmit={handleVaultSubmit}
            handleDelete={handleDelete}
            onCopyPassword={(password) => copyToClipboard(password, 15)}
          />
        )}
      </main>
    </div>
  );
}
