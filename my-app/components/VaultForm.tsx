import { Theme, VaultForm, VaultItem } from "../types";

interface VaultFormProps {
  editingItem: VaultItem | null;
  vaultForm: VaultForm;
  setVaultForm: (form: VaultForm) => void;
  handleVaultSubmit: (e: React.FormEvent) => void;
  setShowForm: (show: boolean) => void;
  theme?: Theme;
}

export const VaultFormComponent = ({
  editingItem,
  vaultForm,
  setVaultForm,
  handleVaultSubmit,
  setShowForm,
  theme,
}: VaultFormProps) => (
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
        type="text"
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
