// Types for the Password Manager application

export interface User {
  id: string;
  name: string;
  email: string;
  twoFactorEnabled?: boolean;
}

export interface VaultItem {
  _id: string;
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  createdAt: string;
}

export interface PasswordOptions {
  length: number;
  includeNumbers: boolean;
  includeLetters: boolean;
  includeSymbols: boolean;
  excludeLookAlikes: boolean;
}

export interface TwoFactorSetup {
  qrCode: string;
  secret: string;
  backupCodes: string[];
}

export interface AuthForm {
  name: string;
  email: string;
  password: string;
  totpToken: string;
}

export interface VaultForm {
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
}

export interface CopyFeedback {
  show: boolean;
  message: string;
}

export type Theme = "light" | "dark";
export type ViewType = "auth" | "generator" | "vault" | "settings";
export type AuthMode = "login" | "signup";
