"use client";

import { useCallback, useEffect, useState } from "react";
import { User, VaultItem, PasswordOptions, Theme } from "../types";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { AuthenticationView } from "../components/AuthenticationView";
import { Header } from "../components/Header";
import { VaultView } from "../components/VaultView";
import { PasswordGeneratorView } from "../components/PasswordGeneratorView";
import { SettingsView } from "../components/SettingsView";
import { copyToClipboard, encryptData, decryptData, generatePassword } from "../utils";
  authForm,
  setAuthForm,
  authError,
  setAuthError,
  requires2FA,
  setRequires2FA,
  handleAuth,
  theme,
}: {
  authMode: "login" | "signup";
  setAuthMode: (mode: "login" | "signup") => void;
  authForm: {
    name: string;
    email: string;
    password: string;
    totpToken: string;
  };
  setAuthForm: (form: {
    name: string;
    email: string;
    password: string;
    totpToken: string;
  }) => void;
  authError: string;
  setAuthError: (error: string) => void;
  requires2FA: boolean;
  setRequires2FA: (requires: boolean) => void;
  handleAuth: (e: React.FormEvent) => void;
  theme?: "light" | "dark";
}) => (
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

// Header Component
const Header = ({
  currentView,
  setCurrentView,
  user,
  handleLogout,
  theme,
  toggleTheme,
}: {
  currentView: "auth" | "generator" | "vault" | "settings";
  setCurrentView: (view: "auth" | "generator" | "vault" | "settings") => void;
  user: User | null;
  handleLogout: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}) => (
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

// Password Generator Component
const PasswordGeneratorView = ({
  passwordOptions,
  setPasswordOptions,
  generatedPassword,
  setGeneratedPassword,
  onCopyPassword,
  theme,
}: {
  passwordOptions: PasswordOptions;
  setPasswordOptions: (options: PasswordOptions) => void;
  generatedPassword: string;
  setGeneratedPassword: (password: string) => void;
  onCopyPassword: (password: string) => void;
  theme?: "light" | "dark";
}) => (
  <div
    className={`max-w-2xl mx-auto ${
      theme === "dark" ? "text-white" : "text-black"
    }`}
  >
    <div
      className={`rounded-lg shadow p-6 ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
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
  theme,
}: {
  editingItem: VaultItem | null;
  vaultForm: {
    title: string;
    username: string;
    password: string;
    url: string;
    notes: string;
    tags: string[];
    folder: string;
  };
  setVaultForm: (form: {
    title: string;
    username: string;
    password: string;
    url: string;
    notes: string;
    tags: string[];
    folder: string;
  }) => void;
  handleVaultSubmit: (e: React.FormEvent) => void;
  setShowForm: (show: boolean) => void;
  theme?: "light" | "dark";
}) => (
  <div
    className={`rounded-lg shadow p-6 mb-6 ${
      theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
    }`}
  >
    <h3 className="text-lg font-bold mb-4">
      {editingItem ? "Edit Item" : "Add New Item"}
    </h3>
    <form onSubmit={handleVaultSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={vaultForm.title}
        onChange={(e) => setVaultForm({ ...vaultForm, title: e.target.value })}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
          theme === "dark"
            ? "text-white bg-gray-700 border-gray-600 placeholder-gray-400"
            : "text-black bg-white placeholder-gray-500"
        }`}
        required
      />
      <input
        type="text"
        placeholder="Username"
        value={vaultForm.username}
        onChange={(e) =>
          setVaultForm({ ...vaultForm, username: e.target.value })
        }
        className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
          theme === "dark"
            ? "text-white bg-gray-700 border-gray-600 placeholder-gray-400"
            : "text-black bg-white placeholder-gray-500"
        }`}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={vaultForm.password}
        onChange={(e) =>
          setVaultForm({ ...vaultForm, password: e.target.value })
        }
        className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
          theme === "dark"
            ? "text-white bg-gray-700 border-gray-600 placeholder-gray-400"
            : "text-black bg-white placeholder-gray-500"
        }`}
        required
      />
      <input
        type="url"
        placeholder="URL (optional)"
        value={vaultForm.url}
        onChange={(e) => setVaultForm({ ...vaultForm, url: e.target.value })}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
          theme === "dark"
            ? "text-white bg-gray-700 border-gray-600 placeholder-gray-400"
            : "text-black bg-white placeholder-gray-500"
        }`}
      />
      <textarea
        placeholder="Notes (optional)"
        value={vaultForm.notes}
        onChange={(e) => setVaultForm({ ...vaultForm, notes: e.target.value })}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
          theme === "dark"
            ? "text-white bg-gray-700 border-gray-600 placeholder-gray-400"
            : "text-black bg-white placeholder-gray-500"
        }`}
        rows={3}
      />
      <input
        type="text"
        placeholder="Folder (optional)"
        value={vaultForm.folder}
        onChange={(e) => setVaultForm({ ...vaultForm, folder: e.target.value })}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
          theme === "dark"
            ? "text-white bg-gray-700 border-gray-600 placeholder-gray-400"
            : "text-black bg-white placeholder-gray-500"
        }`}
      />
      <input
        type="text"
        placeholder="Tags (comma-separated, optional)"
        value={vaultForm.tags.join(", ")}
        onChange={(e) =>
          setVaultForm({
            ...vaultForm,
            tags: e.target.value
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag),
          })
        }
        className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
          theme === "dark"
            ? "text-white bg-gray-700 border-gray-600 placeholder-gray-400"
            : "text-black bg-white placeholder-gray-500"
        }`}
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
  theme,
}: {
  item: VaultItem;
  onEdit: (item: VaultItem) => void;
  onDelete: (id: string) => void;
  onCopyPassword: (password: string) => void;
  theme?: "light" | "dark";
}) => (
  <div
    className={`rounded-lg shadow p-6 ${
      theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
    }`}
  >
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
  theme,
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
    tags: string[];
    folder: string;
  };
  setVaultForm: (form: {
    title: string;
    username: string;
    password: string;
    url: string;
    notes: string;
    tags: string[];
    folder: string;
  }) => void;
  handleVaultSubmit: (e: React.FormEvent) => void;
  handleDelete: (id: string) => void;
  onCopyPassword: (password: string) => void;
  theme?: "light" | "dark";
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
      tags: item.tags || [],
      folder: item.folder || "",
    });
    setShowForm(true);
  };

  return (
    <div>
      <div
        className={`flex justify-between items-center mb-6 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
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
              tags: [],
              folder: "",
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
          className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            theme === "dark"
              ? "text-white bg-gray-700 border-gray-600"
              : "text-black bg-white"
          }`}
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
          theme={theme}
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
            theme={theme}
          />
        ))}

        {filteredVaultItems.length === 0 && (
          <div
            className={`text-center py-8 ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {searchTerm
              ? "No items found matching your search."
              : "No vault items yet. Add your first one!"}
          </div>
        )}
      </div>
    </div>
  );
};

// Settings View Component
const SettingsView = ({
  user,
  twoFactorSetup,
  totpToken,
  setTotpToken,
  handleSetup2FA,
  handleDisable2FA,
  handleVerify2FA,
  theme,
}: {
  user: User | null;
  twoFactorSetup: {
    qrCode: string;
    secret: string;
    backupCodes: string[];
  } | null;
  totpToken: string;
  setTotpToken: (token: string) => void;
  handleSetup2FA: () => void;
  handleDisable2FA: () => void;
  handleVerify2FA: () => void;
  theme?: "light" | "dark";
}) => {
  // Debug log to check user state
  console.log("Settings - Current user state:", user);

  return (
    <div
      className={`max-w-4xl mx-auto ${
        theme === "dark" ? "text-white" : "text-black"
      }`}
    >
      <div
        className={`rounded-lg shadow p-6 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6">Security Settings</h2>

        {/* Two-Factor Authentication Section */}
        <div className="border-b pb-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            Two-Factor Authentication (2FA)
          </h3>

          {user?.twoFactorEnabled ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-green-700 font-medium">
                  2FA is enabled
                </span>
              </div>
              <p className="text-gray-600">
                Your account is protected with two-factor authentication. You'll
                need your authenticator app to sign in.
              </p>
              <button
                onClick={handleDisable2FA}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
              >
                Disable 2FA
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="inline-block w-3 h-3 bg-gray-400 rounded-full"></span>
                <span className="text-gray-700 font-medium">
                  2FA is disabled
                </span>
              </div>
              <p className="text-gray-600">
                Add an extra layer of security to your account by enabling
                two-factor authentication.
              </p>

              {!twoFactorSetup ? (
                <button
                  onClick={handleSetup2FA}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Enable 2FA
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">
                      Setup Your Authenticator
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-700">
                      <li>
                        Install an authenticator app (Google Authenticator,
                        Authy, etc.)
                      </li>
                      <li>
                        Scan the QR code below with your authenticator app
                      </li>
                      <li>
                        Enter the 6-digit code from your app to verify setup
                      </li>
                    </ol>
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-lg border">
                      <img
                        src={twoFactorSetup.qrCode}
                        alt="2FA QR Code"
                        className="w-48 h-48"
                      />
                    </div>
                  </div>

                  {/* Manual Setup Code */}
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600 mb-1">
                      Can't scan? Enter this code manually:
                    </p>
                    <code className="text-xs bg-white px-2 py-1 rounded border font-mono">
                      {twoFactorSetup.secret}
                    </code>
                  </div>

                  {/* Verification */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Enter verification code:
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="000000"
                        value={totpToken}
                        onChange={(e) => setTotpToken(e.target.value)}
                        className={`flex-1 px-3 py-2 border border-gray-300 rounded-md ${
                          theme === "dark"
                            ? "text-white bg-gray-700 border-gray-600 placeholder-gray-400"
                            : "text-black bg-white placeholder-gray-500"
                        }`}
                        maxLength={6}
                      />
                      <button
                        onClick={handleVerify2FA}
                        disabled={totpToken.length !== 6}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded cursor-pointer"
                      >
                        Verify & Enable
                      </button>
                    </div>
                  </div>

                  {/* Backup Codes */}
                  {twoFactorSetup.backupCodes &&
                    twoFactorSetup.backupCodes.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-semibold text-red-800 mb-2">
                          ⚠️ Backup Codes
                        </h4>
                        <p className="text-sm text-red-700 mb-3">
                          Save these backup codes in a secure place. You can use
                          them to access your account if you lose your
                          authenticator device.
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {twoFactorSetup.backupCodes.map((code, index) => (
                            <code
                              key={index}
                              className="bg-white px-2 py-1 rounded border font-mono"
                            >
                              {code}
                            </code>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Account Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Account Information</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-600">Name:</span>
              <span className="ml-2 font-medium">{user?.name}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Email:</span>
              <span className="ml-2 font-medium">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PasswordManager() {
  // Theme
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    setMounted(true);
    document.documentElement.className = initialTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.className = newTheme;
  };

  // App state
  const [currentView, setCurrentView] = useState<
    "auth" | "generator" | "vault" | "settings"
  >("auth");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth state
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    totpToken: "",
  });
  const [authError, setAuthError] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);

  // 2FA state
  const [twoFactorSetup, setTwoFactorSetup] = useState<{
    secret: string;
    qrCode: string;
    backupCodes: string[];
  } | null>(null);
  const [totpToken, setTotpToken] = useState("");

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
  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
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
    tags: [] as string[],
    folder: "",
  });

  // Export/Import state
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [exportPassword, setExportPassword] = useState("");
  const [importPassword, setImportPassword] = useState("");
  const [importFile, setImportFile] = useState<File | null>(null);

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

  // Check authentication function
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          if (currentView === "auth") {
            setCurrentView("generator");
          }
          loadVaultItems();
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  }, [currentView]);

  // Refresh user data without affecting loading state
  const refreshUserData = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log("User data refreshed:", data.user); // Debug log
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error("Refresh user data failed:", error);
    }
  };

  // Check authentication on load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const url = authMode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const payload =
      authMode === "login"
        ? {
            email: authForm.email,
            password: authForm.password,
            totpToken: authForm.totpToken, // Include 2FA token for login
          }
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
        // Reset auth form
        setAuthForm({
          name: "",
          email: "",
          password: "",
          totpToken: "",
        });
      } else {
        setAuthError(data.message);
        // If 2FA is required, keep the form data but clear the TOTP token
        if (data.requires2FA) {
          setRequires2FA(true);
          setAuthForm({
            ...authForm,
            totpToken: "", // Clear only the TOTP token
          });
        }
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
          tags: [],
          folder: "",
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

  // 2FA Functions
  const handleSetup2FA = async () => {
    try {
      const response = await fetch("/api/auth/2fa/setup", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setTwoFactorSetup({
          qrCode: data.qrCode,
          secret: data.secret,
          backupCodes: data.backupCodes || [],
        });
      } else {
        alert("Failed to setup 2FA: " + data.message);
      }
    } catch (error) {
      console.error("2FA setup error:", error);
      alert("Failed to setup 2FA");
    }
  };

  const handleVerify2FA = async () => {
    try {
      const response = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token: totpToken }),
      });

      const data = await response.json();

      if (data.success) {
        alert("2FA enabled successfully!");
        setTwoFactorSetup(null);
        setTotpToken("");
        // Refresh user data to show 2FA as enabled
        await refreshUserData();
      } else {
        alert("Failed to verify 2FA: " + data.message);
      }
    } catch (error) {
      console.error("2FA verification error:", error);
      alert("Failed to verify 2FA");
    }
  };

  const handleDisable2FA = async () => {
    if (
      !confirm(
        "Are you sure you want to disable 2FA? This will make your account less secure."
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/auth/2fa/disable", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        alert("2FA disabled successfully");
        // Refresh user data to show 2FA as disabled
        await refreshUserData();
      } else {
        alert("Failed to disable 2FA: " + data.message);
      }
    } catch (error) {
      console.error("2FA disable error:", error);
      alert("Failed to disable 2FA");
    }
  };

  // Render loading state
  if (loading) {
    return <LoadingSpinner theme={theme} />;
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
        setAuthError={setAuthError}
        requires2FA={requires2FA}
        setRequires2FA={setRequires2FA}
        handleAuth={handleAuth}
        theme={theme}
      />
    );
  }

  // Render main app with header and content
  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
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
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === "generator" && (
          <PasswordGeneratorView
            passwordOptions={passwordOptions}
            setPasswordOptions={setPasswordOptions}
            generatedPassword={generatedPassword}
            setGeneratedPassword={setGeneratedPassword}
            onCopyPassword={(password) => copyToClipboard(password, 15)}
            theme={theme}
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
            theme={theme}
          />
        )}

        {currentView === "settings" && (
          <SettingsView
            user={user}
            twoFactorSetup={twoFactorSetup}
            totpToken={totpToken}
            setTotpToken={setTotpToken}
            handleSetup2FA={handleSetup2FA}
            handleDisable2FA={handleDisable2FA}
            handleVerify2FA={handleVerify2FA}
            theme={theme}
          />
        )}
      </main>
    </div>
  );
}
