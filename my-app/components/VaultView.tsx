import { Theme, VaultForm, VaultItem } from "../types";
import { decryptData } from "../utils";
import { ExportModal, ImportModal } from "./ImportExportModals";
import { VaultFormComponent } from "./VaultForm";
import { VaultItemComponent } from "./VaultItem";

interface VaultViewProps {
  vaultItems: VaultItem[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  editingItem: VaultItem | null;
  setEditingItem: (item: VaultItem | null) => void;
  vaultForm: VaultForm;
  setVaultForm: (form: VaultForm) => void;
  handleVaultSubmit: (e: React.FormEvent) => void;
  handleDelete: (id: string) => void;
  onCopyPassword: (password: string) => void;
  theme?: Theme;
  // Export/Import props
  showExportModal: boolean;
  setShowExportModal: (show: boolean) => void;
  showImportModal: boolean;
  setShowImportModal: (show: boolean) => void;
  exportPassword: string;
  setExportPassword: (password: string) => void;
  importPassword: string;
  setImportPassword: (password: string) => void;
  importFile: File | null;
  setImportFile: (file: File | null) => void;
  handleExport: () => void;
  handleImport: () => void;
}

export const VaultView = ({
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
  showExportModal,
  setShowExportModal,
  showImportModal,
  setShowImportModal,
  exportPassword,
  setExportPassword,
  importPassword,
  setImportPassword,
  importFile,
  setImportFile,
  handleExport,
  handleImport,
}: VaultViewProps) => {
  // Debug logging
  console.log(
    "VaultView received vaultItems:",
    vaultItems,
    "Type:",
    typeof vaultItems,
    "IsArray:",
    Array.isArray(vaultItems),
    "Length:",
    vaultItems?.length
  );

  // Ensure vaultItems is always an array
  const safeVaultItems = Array.isArray(vaultItems) ? vaultItems : [];

  console.log(
    "Safe vault items:",
    safeVaultItems,
    "Length:",
    safeVaultItems.length
  );

  const filteredVaultItems = safeVaultItems.filter((item) => {
    console.log("Filtering item:", item);

    if (!item) {
      console.log("Item is null/undefined");
      return false;
    }

    // Make the filter more lenient - only require title
    if (!item.title) {
      console.log("Item has no title, filtering out");
      return false;
    }

    // If no search term, show all items
    if (!searchTerm || searchTerm.trim() === "") {
      console.log("No search term, including item");
      return true;
    }

    // Search in available fields
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (item.title && item.title.toLowerCase().includes(searchLower)) ||
      (item.username && item.username.toLowerCase().includes(searchLower)) ||
      (item.url && item.url.toLowerCase().includes(searchLower));

    console.log("Search term:", searchTerm, "Matches search:", matchesSearch);
    return matchesSearch;
  });

  console.log(
    "Filtered vault items:",
    filteredVaultItems,
    "Length:",
    filteredVaultItems.length
  );

  const handleEdit = (item: VaultItem) => {
    setEditingItem(item);
    setVaultForm({
      title: item.title,
      username: item.username,
      password: item.password ? decryptData(item.password) : "",
      url: item.url,
      notes: item.notes ? decryptData(item.notes) : "",
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
        <div className="flex space-x-2">
          <button
            onClick={() => setShowExportModal(true)}
            className="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Export
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-orange-600 cursor-pointer hover:bg-orange-700 text-white px-4 py-2 rounded"
          >
            Import
          </button>
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
              ? "text-white bg-gray-700 border-gray-600 placeholder-gray-400"
              : "text-black bg-white placeholder-gray-500"
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

      {/* Export/Import Modals */}
      <ExportModal
        showModal={showExportModal}
        onClose={() => {
          setShowExportModal(false);
          setExportPassword("");
        }}
        exportPassword={exportPassword}
        setExportPassword={setExportPassword}
        onExport={handleExport}
        theme={theme}
      />

      <ImportModal
        showModal={showImportModal}
        onClose={() => {
          setShowImportModal(false);
          setImportPassword("");
          setImportFile(null);
        }}
        importPassword={importPassword}
        setImportPassword={setImportPassword}
        importFile={importFile}
        setImportFile={setImportFile}
        onImport={handleImport}
        theme={theme}
      />
    </div>
  );
};
