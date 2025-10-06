import { PasswordOptions, Theme } from "../types";
import { generatePassword } from "../utils";

interface PasswordGeneratorViewProps {
  passwordOptions: PasswordOptions;
  setPasswordOptions: (options: PasswordOptions) => void;
  generatedPassword: string;
  setGeneratedPassword: (password: string) => void;
  onCopyPassword: (password: string) => void;
  theme?: Theme;
}

export const PasswordGeneratorView = ({
  passwordOptions,
  setPasswordOptions,
  generatedPassword,
  setGeneratedPassword,
  onCopyPassword,
  theme,
}: PasswordGeneratorViewProps) => (
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
          <div
            className={`p-4 rounded ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
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
            <p
              className={`text-xs mt-2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Password will be cleared from clipboard in 15 seconds
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);
