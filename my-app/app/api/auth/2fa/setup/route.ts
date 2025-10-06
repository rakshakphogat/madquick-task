import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import speakeasy from "speakeasy";
import { setCorsHeaders, verifyToken } from "../../../../../lib/auth";
import connectToDatabase from "../../../../../lib/mongodb";
import { User } from "../../../../../models/User";

// Setup 2FA - Generate secret and QR code
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

    // Generate a secret for the user
    const secret = speakeasy.generateSecret({
      name: `Password Manager (${user.email})`,
      issuer: "Madquick Password Manager",
      length: 32,
    });

    // Save the secret to the user (but don't enable 2FA yet)
    await User.findByIdAndUpdate(user._id, {
      twoFactorSecret: secret.base32,
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    const response = NextResponse.json({
      success: true,
      secret: secret.base32,
      qrCode: qrCodeUrl,
      manualEntryKey: secret.base32,
    });

    return setCorsHeaders(response);
  } catch (error) {
    console.error("2FA setup error:", error);
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
