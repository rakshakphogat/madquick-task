import { Theme } from "../types";

interface ExportModalProps {
  showModal: boolean;
  onClose: () => void;
  exportPassword: string;
  setExportPassword: (password: string) => void;
  onExport: () => void;
  theme?: Theme;
}

export const ExportModal = ({
  showModal,
  onClose,
  exportPassword,
  setExportPassword,
  onExport,
  theme,
}: ExportModalProps) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`max-w-md w-full p-6 rounded-lg shadow-lg ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h3 className="text-lg font-bold mb-4">Export Vault Data</h3>
        <p className="text-sm text-gray-600 mb-4">
          Enter a password to encrypt your exported vault data. Keep this
          password safe - you'll need it to import the data later.
        </p>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Export password"
            value={exportPassword}
            onChange={(e) => setExportPassword(e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
              theme === "dark"
                ? "text-white bg-gray-700 border-gray-600 placeholder-gray-400"
                : "text-black bg-white placeholder-gray-500"
            }`}
            required
          />

          <div className="flex space-x-2">
            <button
              onClick={onExport}
              disabled={!exportPassword}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded cursor-pointer"
            >
              Export
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ImportModalProps {
  showModal: boolean;
  onClose: () => void;
  importPassword: string;
  setImportPassword: (password: string) => void;
  importFile: File | null;
  setImportFile: (file: File | null) => void;
  onImport: () => void;
  theme?: Theme;
}

export const ImportModal = ({
  showModal,
  onClose,
  importPassword,
  setImportPassword,
  importFile,
  setImportFile,
  onImport,
  theme,
}: ImportModalProps) => {
  if (!showModal) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImportFile(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`max-w-md w-full p-6 rounded-lg shadow-lg ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h3 className="text-lg font-bold mb-4">Import Vault Data</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select your exported vault file and enter the password you used when
          exporting.
        </p>

        <div className="space-y-4">
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
              theme === "dark"
                ? "text-white bg-gray-700 border-gray-600"
                : "text-black bg-white"
            }`}
          />

          <input
            type="password"
            placeholder="Import password"
            value={importPassword}
            onChange={(e) => setImportPassword(e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
              theme === "dark"
                ? "text-white bg-gray-700 border-gray-600 placeholder-gray-400"
                : "text-black bg-white placeholder-gray-500"
            }`}
            required
          />

          <div className="flex space-x-2">
            <button
              onClick={onImport}
              disabled={!importFile || !importPassword}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded cursor-pointer"
            >
              Import
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
