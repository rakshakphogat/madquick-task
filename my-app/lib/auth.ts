import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { User } from "../models/User";
import connectToDatabase from "./mongodb";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

// Generate JWT token
export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

// Parse cookies from request
export const parseCookies = (
  cookieHeader: string | null
): Record<string, string> => {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(";").forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });

  return cookies;
};

// Set authentication cookie
export const setAuthCookie = (response: NextResponse, token: string) => {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieValue = `authToken=${token}; HttpOnly; Path=/; Max-Age=${
    7 * 24 * 60 * 60
  }; SameSite=Lax${isProduction ? "; Secure" : ""}`;

  response.headers.set("Set-Cookie", cookieValue);
  return response;
};

// Clear authentication cookie
export const clearAuthCookie = (response: NextResponse) => {
  const cookieValue = `authToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
  response.headers.set("Set-Cookie", cookieValue);
  return response;
};

// Verify and get user from token
export const verifyToken = async (request: NextRequest) => {
  try {
    await connectToDatabase();

    const cookies = parseCookies(request.headers.get("cookie"));
    const token = cookies.authToken;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId).select("-password");

    return user;
  } catch {
    return null;
  }
};

// CORS headers for API responses
export const setCorsHeaders = (response: NextResponse) => {
  // In development, allow any origin; in production, only allow the deployed domain
  const origin =
    process.env.NODE_ENV === "development"
      ? "*"
      : "https://madquick-task-txle.vercel.app";

  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Cookie"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
};
