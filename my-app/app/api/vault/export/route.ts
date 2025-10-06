import CryptoJS from "crypto-js";
import { NextRequest, NextResponse } from "next/server";
import { setCorsHeaders, verifyToken } from "../../../../lib/auth";
import connectToDatabase from "../../../../lib/mongodb";
import { VaultItem } from "../../../../models/VaultItem";

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

    const { exportPassword } = await request.json();

    if (!exportPassword) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Export password is required",
        },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    // Get all vault items for the user
    const vaultItems = await VaultItem.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Create export data
    const exportData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      userEmail: user.email,
      items: vaultItems.map((item) => ({
        title: item.title,
        username: item.username,
        password: item.password, // Already encrypted from client
        url: item.url,
        notes: item.notes,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    };

    // Encrypt the export data with the provided password
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(exportData),
      exportPassword
    ).toString();

    // Create the export file content
    const exportFile = {
      type: "madquick-password-manager-export",
      version: "1.0",
      data: encryptedData,
      checksum: CryptoJS.SHA256(encryptedData).toString(),
    };

    const response = NextResponse.json({
      success: true,
      exportData: exportFile,
      itemCount: vaultItems.length,
    });

    return setCorsHeaders(response);
  } catch (error) {
    console.error("Export error:", error);
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
