import CryptoJS from "crypto-js";
import { PasswordOptions } from "../types";

// Encryption functions
const ENCRYPTION_KEY = "user-master-key"; // In real app, derive from user password

export const encryptData = (text: string): string => {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

export const decryptData = (encryptedText: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Password generator function
export const generatePassword = (options: PasswordOptions): string => {
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

// Clipboard functions
export const copyToClipboard = async (
  text: string,
  setCopyFeedback: (feedback: { show: boolean; message: string }) => void,
  clearAfter: number = 15
) => {
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
    return fallbackCopyToClipboard(text, setCopyFeedback, clearAfter);
  } catch (error) {
    console.warn("Clipboard write failed, using fallback:", error);
    return fallbackCopyToClipboard(text, setCopyFeedback, clearAfter);
  }
};

// Fallback clipboard method using execCommand
const fallbackCopyToClipboard = (
  text: string,
  setCopyFeedback: (feedback: { show: boolean; message: string }) => void,
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
