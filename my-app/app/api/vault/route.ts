import { NextRequest, NextResponse } from "next/server";
import { setCorsHeaders, verifyToken } from "../../../lib/auth";
import connectToDatabase from "../../../lib/mongodb";
import { VaultItem } from "../../../models/VaultItem";

// GET all vault items for authenticated user
export async function GET(request: NextRequest) {
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

    const vaultItems = await VaultItem.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    const response = NextResponse.json({
      success: true,
      data: vaultItems,
    });

    return setCorsHeaders(response);
  } catch (error) {
    console.error("Get vault items error:", error);
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

// POST create new vault item
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

    const { title, username, password, url, notes } = await request.json();

    // Validation
    if (!title || !username || !password) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Title, username, and password are required",
        },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    const vaultItem = new VaultItem({
      userId: user._id,
      title,
      username,
      password, // This should be encrypted on the client side
      url: url || "",
      notes: notes || "",
    });

    await vaultItem.save();

    const response = NextResponse.json(
      {
        success: true,
        message: "Vault item created successfully",
        data: vaultItem,
      },
      { status: 201 }
    );

    return setCorsHeaders(response);
  } catch (error) {
    console.error("Create vault item error:", error);
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
