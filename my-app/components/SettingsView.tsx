import { Theme, TwoFactorSetup, User } from "../types";

interface SettingsViewProps {
  user: User | null;
  twoFactorSetup: TwoFactorSetup | null;
  totpToken: string;
  setTotpToken: (token: string) => void;
  handleSetup2FA: () => void;
  handleDisable2FA: () => void;
  handleVerify2FA: () => void;
  theme?: Theme;
}

export const SettingsView = ({
  user,
  twoFactorSetup,
  totpToken,
  setTotpToken,
  handleSetup2FA,
  handleDisable2FA,
  handleVerify2FA,
  theme,
}: SettingsViewProps) => {
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
                Your account is protected with two-factor authentication.
                You&apos;ll need your authenticator app to sign in.
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
                      Can&apos;t scan? Enter this code manually:
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
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Name:
              </span>
              <span
                className={`ml-2 font-medium ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {user?.name || "Not available"}
              </span>
            </div>
            <div>
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Email:
              </span>
              <span
                className={`ml-2 font-medium ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {user?.email || "Not available"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
