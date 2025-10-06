"use client";

import { useCallback, useEffect, useState } from "react";
import { AuthenticationView } from "../components/AuthenticationView";
import { Header } from "../components/Header";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { PasswordGeneratorView } from "../components/PasswordGeneratorView";
import { SettingsView } from "../components/SettingsView";
import { VaultView } from "../components/VaultView";
import {
  AuthForm,
  PasswordOptions,
  Theme,
  TwoFactorSetup,
  User,
  VaultForm,
  VaultItem,
} from "../types";
import { copyToClipboard, encryptData } from "../utils";

export default function PasswordManager() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<
    "auth" | "generator" | "vault" | "settings"
  >("generator");
  const [theme, setTheme] = useState<Theme>("light");

  // Auth states
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authForm, setAuthForm] = useState<AuthForm>({
    name: "",
    email: "",
    password: "",
    totpToken: "",
  });
  const [authError, setAuthError] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);

  // Vault states
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);
  const [vaultForm, setVaultForm] = useState<VaultForm>({
    title: "",
    username: "",
    password: "",
    url: "",
    notes: "",
  });

  // Export/Import states
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [exportPassword, setExportPassword] = useState("");
  const [importPassword, setImportPassword] = useState("");
  const [importFile, setImportFile] = useState<File | null>(null);

  // Copy feedback state
  const [copyFeedback, setCopyFeedback] = useState({
    show: false,
    message: "",
  });

  // Password generator states
  const [passwordOptions, setPasswordOptions] = useState<PasswordOptions>({
    length: 12,
    includeNumbers: true,
    includeLetters: true,
    includeSymbols: true,
    excludeLookAlikes: false,
  });
  const [generatedPassword, setGeneratedPassword] = useState("");

  // Settings states
  const [twoFactorSetup, setTwoFactorSetup] = useState<TwoFactorSetup | null>(
    null
  );
  const [totpToken, setTotpToken] = useState("");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    try {
      const endpoint =
        authMode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const payload =
        authMode === "login"
          ? {
              email: authForm.email,
              password: authForm.password,
              totpToken: authForm.totpToken,
            }
          : {
              name: authForm.name,
              email: authForm.email,
              password: authForm.password,
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.requires2FA) {
          setRequires2FA(true);
          setAuthError("Please enter your 2FA code");
        } else {
          setAuthError(data.error);
        }
        return;
      }

      setUser(data.user);
      setCurrentView("vault");
      setAuthForm({ name: "", email: "", password: "", totpToken: "" });
      setRequires2FA(false);
    } catch (error) {
      setAuthError("Network error occurred");
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API to clear cookie
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
    setCurrentView("auth");
    setVaultItems([]);
  };

  const fetchVaultItems = useCallback(async () => {
    try {
      const res = await fetch("/api/vault", {
        credentials: "include",
      });
      const response = await res.json();

      if (res.ok && response.success) {
        // Extract the actual data array from the response
        const items = Array.isArray(response.data) ? response.data : [];
        setVaultItems(items);
      } else {
        console.error("Failed to fetch vault items:", response);
        setVaultItems([]);
      }
    } catch {
      console.error("Failed to fetch vault items");
      setVaultItems([]);
    }
  }, []);

  const handleVaultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const encryptedData = {
        ...vaultForm,
        password: encryptData(vaultForm.password),
        notes: encryptData(vaultForm.notes),
      };

      const url = editingItem ? `/api/vault/${editingItem._id}` : "/api/vault";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(encryptedData),
      });

      if (res.ok) {
        await fetchVaultItems();
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
      console.error("Failed to save vault item:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const res = await fetch(`/api/vault/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          await fetchVaultItems();
        }
      } catch (error) {
        console.error("Failed to delete vault item:", error);
      }
    }
  };

  const handleSetup2FA = async () => {
    try {
      const res = await fetch("/api/auth/setup-2fa", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setTwoFactorSetup(data);
      }
    } catch (error) {
      console.error("Failed to setup 2FA:", error);
    }
  };

  const handleVerify2FA = async () => {
    try {
      const res = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token: totpToken }),
      });

      if (res.ok) {
        const updatedUser = { ...user!, twoFactorEnabled: true };
        setUser(updatedUser);
        setTwoFactorSetup(null);
        setTotpToken("");
        alert("2FA enabled successfully!");
      } else {
        alert("Invalid 2FA code");
      }
    } catch (error) {
      console.error("Failed to verify 2FA:", error);
    }
  };

  const handleDisable2FA = async () => {
    if (confirm("Are you sure you want to disable 2FA?")) {
      try {
        const res = await fetch("/api/auth/disable-2fa", {
          method: "POST",
          credentials: "include",
        });

        if (res.ok) {
          const updatedUser = { ...user!, twoFactorEnabled: false };
          setUser(updatedUser);
          alert("2FA disabled successfully!");
        }
      } catch (error) {
        console.error("Failed to disable 2FA:", error);
      }
    }
  };

  const handleExport = () => {
    try {
      if (!exportPassword) {
        alert("Please enter a password for the export file");
        return;
      }

      const dataToExport = {
        exportDate: new Date().toISOString(),
        vaultItems: vaultItems.map((item) => ({
          ...item,
          // Keep data encrypted as it is
        })),
      };

      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `vault-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setShowExportModal(false);
      setExportPassword("");
      alert("Vault exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export vault");
    }
  };

  const handleImport = async () => {
    try {
      if (!importFile) {
        alert("Please select a file to import");
        return;
      }

      if (!importPassword) {
        alert("Please enter the password for the import file");
        return;
      }

      const fileText = await importFile.text();
      const importData = JSON.parse(fileText);

      if (!importData.vaultItems || !Array.isArray(importData.vaultItems)) {
        throw new Error("Invalid vault file format");
      }

      // Import the items
      for (const item of importData.vaultItems) {
        await fetch("/api/vault", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: item.title,
            username: item.username,
            password: item.password, // Already encrypted
            url: item.url,
            notes: item.notes, // Already encrypted
          }),
        });
      }

      await fetchVaultItems();
      setShowImportModal(false);
      setImportPassword("");
      setImportFile(null);
      alert(`Successfully imported ${importData.vaultItems.length} items!`);
    } catch (error) {
      console.error("Import failed:", error);
      alert("Failed to import vault: " + (error as Error).message);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });
        if (res.ok) {
          const userData = await res.json();
          if (userData.success && userData.user) {
            setUser(userData.user);
            setCurrentView("vault");
          }
        }
      } catch {
        // Failed to authenticate
      }
      setCurrentView("auth");
      setLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (user && currentView === "vault") {
      fetchVaultItems();
    }
  }, [user, currentView, fetchVaultItems]);

  if (loading) {
    return <LoadingSpinner theme={theme} />;
  }

  if (!user) {
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

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        handleLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="container mx-auto p-6">
        {currentView === "generator" && (
          <PasswordGeneratorView
            passwordOptions={passwordOptions}
            setPasswordOptions={setPasswordOptions}
            generatedPassword={generatedPassword}
            setGeneratedPassword={setGeneratedPassword}
            onCopyPassword={(password) =>
              copyToClipboard(password, setCopyFeedback)
            }
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
            onCopyPassword={(password) =>
              copyToClipboard(password, setCopyFeedback)
            }
            theme={theme}
            showExportModal={showExportModal}
            setShowExportModal={setShowExportModal}
            showImportModal={showImportModal}
            setShowImportModal={setShowImportModal}
            exportPassword={exportPassword}
            setExportPassword={setExportPassword}
            importPassword={importPassword}
            setImportPassword={setImportPassword}
            importFile={importFile}
            setImportFile={setImportFile}
            handleExport={handleExport}
            handleImport={handleImport}
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

      {/* Copy feedback */}
      {copyFeedback.show && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {copyFeedback.message}
        </div>
      )}
    </div>
  );
}
