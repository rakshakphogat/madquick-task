import { NextResponse } from "next/server";
import { clearAuthCookie, setCorsHeaders } from "../../../../lib/auth";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
    });

    clearAuthCookie(response);
    return setCorsHeaders(response);
  } catch (error) {
    console.error("Logout error:", error);
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
