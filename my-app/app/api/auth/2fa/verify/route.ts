import { NextRequest, NextResponse } from "next/server";
import speakeasy from "speakeasy";
import { setCorsHeaders, verifyToken } from "../../../../../lib/auth";
import connectToDatabase from "../../../../../lib/mongodb";
import { User } from "../../../../../models/User";

// Verify and enable 2FA
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const user = await verifyToken(request);
    if (!user) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Access token is required",
        },
        { status: 401 }
      );
      return setCorsHeaders(response);
    }

    const { token } = await request.json();

    if (!token) {
      const response = NextResponse.json(
        {
          success: false,
          message: "TOTP token is required",
        },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    // Get user with secret
    const userWithSecret = await User.findById(user._id);
    if (!userWithSecret || !userWithSecret.twoFactorSecret) {
      const response = NextResponse.json(
        {
          success: false,
          message: "2FA setup not found. Please setup 2FA first.",
        },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: userWithSecret.twoFactorSecret,
      encoding: "base32",
      token: token,
      window: 2, // Allow 2 time steps of variance
    });

    if (!verified) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Invalid TOTP token",
        },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    // Enable 2FA for the user
    await User.findByIdAndUpdate(user._id, {
      twoFactorEnabled: true,
    });

    const response = NextResponse.json({
      success: true,
      message: "2FA enabled successfully",
    });

    return setCorsHeaders(response);
  } catch (error) {
    console.error("2FA verify error:", error);
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
