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

    const { importData, importPassword, replaceExisting } =
      await request.json();

    if (!importData || !importPassword) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Import data and password are required",
        },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    // Validate import file structure
    if (
      !importData.type ||
      importData.type !== "madquick-password-manager-export"
    ) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Invalid export file format",
        },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    // Verify checksum
    const calculatedChecksum = CryptoJS.SHA256(importData.data).toString();
    if (calculatedChecksum !== importData.checksum) {
      const response = NextResponse.json(
        {
          success: false,
          message: "File integrity check failed",
        },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    // Decrypt the data
    let decryptedData;
    try {
      const bytes = CryptoJS.AES.decrypt(importData.data, importPassword);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedString) {
        throw new Error("Decryption failed");
      }

      decryptedData = JSON.parse(decryptedString);
    } catch {
      const response = NextResponse.json(
        {
          success: false,
          message: "Invalid password or corrupted data",
        },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    // Validate decrypted data structure
    if (!decryptedData.items || !Array.isArray(decryptedData.items)) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Invalid export data structure",
        },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    // If replacing existing, delete all user's vault items
    if (replaceExisting) {
      await VaultItem.deleteMany({ userId: user._id });
    }

    // Import the items
    const importedItems = [];
    for (const item of decryptedData.items) {
      try {
        const newItem = new VaultItem({
          userId: user._id,
          title: item.title,
          username: item.username,
          password: item.password,
          url: item.url || "",
          notes: item.notes || "",
        });

        await newItem.save();
        importedItems.push(newItem);
      } catch (error) {
        console.error("Error importing item:", error);
        // Continue with other items
      }
    }

    const response = NextResponse.json({
      success: true,
      message: `Successfully imported ${importedItems.length} items`,
      importedCount: importedItems.length,
      totalItems: decryptedData.items.length,
    });

    return setCorsHeaders(response);
  } catch (error) {
    console.error("Import error:", error);
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
