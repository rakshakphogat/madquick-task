import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import speakeasy from "speakeasy";
import {
  generateToken,
  setAuthCookie,
  setCorsHeaders,
} from "../../../../lib/auth";
import connectToDatabase from "../../../../lib/mongodb";
import { User } from "../../../../models/User";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { email, password, totpToken } = await request.json();

    // Validation
    if (!email || !password) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
      return setCorsHeaders(response);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
      return setCorsHeaders(response);
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled && user.twoFactorSecret) {
      if (!totpToken) {
        const response = NextResponse.json(
          {
            success: false,
            message: "2FA token is required",
            requires2FA: true,
          },
          { status: 401 }
        );
        return setCorsHeaders(response);
      }

      // Verify 2FA token
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token: totpToken,
        window: 2,
      });

      if (!verified) {
        const response = NextResponse.json(
          {
            success: false,
            message: "Invalid 2FA token",
            requires2FA: true,
          },
          { status: 401 }
        );
        return setCorsHeaders(response);
      }
    }

    // Generate token
    const token = generateToken(user._id.toString());

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });

    setAuthCookie(response, token);
    return setCorsHeaders(response);
  } catch (error) {
    console.error("Login error:", error);
    const response = NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
    return setCorsHeaders(response);
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  return setCorsHeaders(response);
}
