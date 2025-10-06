import { NextRequest, NextResponse } from "next/server";
import { setCorsHeaders, verifyToken } from "../../../../../lib/auth";
import connectToDatabase from "../../../../../lib/mongodb";
import { User } from "../../../../../models/User";

// Disable 2FA
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

    // Disable 2FA for the user
    await User.findByIdAndUpdate(user._id, {
      twoFactorEnabled: false,
      twoFactorSecret: null,
    });

    const response = NextResponse.json({
      success: true,
      message: "2FA disabled successfully",
    });

    return setCorsHeaders(response);
  } catch (error) {
    console.error("2FA disable error:", error);
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
