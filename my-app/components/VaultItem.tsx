import { Theme, VaultItem } from "../types";
import { decryptData } from "../utils";

interface VaultItemProps {
  item: VaultItem;
  onEdit: (item: VaultItem) => void;
  onDelete: (id: string) => void;
  onCopyPassword: (password: string) => void;
  theme?: Theme;
}

export const VaultItemComponent = ({
  item,
  onEdit,
  onDelete,
  onCopyPassword,
  theme,
}: VaultItemProps) => {
  // Decrypt sensitive data for display
  const decryptedPassword = item.password ? decryptData(item.password) : "";
  const decryptedNotes = item.notes ? decryptData(item.notes) : "";

  return (
    <div
      className={`rounded-lg shadow p-6 ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p
            className={`${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Username: {item.username}
          </p>
          <p
            className={`${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Password: {decryptedPassword}
          </p>
          {item.url && (
            <p className="text-blue-600">
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.url}
              </a>
            </p>
          )}
          {decryptedNotes && (
            <p
              className={`${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              } mt-2`}
            >
              {decryptedNotes}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onCopyPassword(decryptedPassword)}
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
};
