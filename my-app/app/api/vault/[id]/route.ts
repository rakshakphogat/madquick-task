import { NextRequest, NextResponse } from "next/server";
import { setCorsHeaders, verifyToken } from "../../../../lib/auth";
import connectToDatabase from "../../../../lib/mongodb";
import { VaultItem } from "../../../../models/VaultItem";

// PUT update vault item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

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

    // Find and update the vault item
    const vaultItem = await VaultItem.findOneAndUpdate(
      { _id: id, userId: user._id },
      {
        title,
        username,
        password, // This should be encrypted on the client side
        url: url || "",
        notes: notes || "",
      },
      { new: true, runValidators: true }
    );

    if (!vaultItem) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Vault item not found",
        },
        { status: 404 }
      );
      return setCorsHeaders(response);
    }

    const response = NextResponse.json({
      success: true,
      message: "Vault item updated successfully",
      data: vaultItem,
    });

    return setCorsHeaders(response);
  } catch (error) {
    console.error("Update vault item error:", error);
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

// DELETE vault item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

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

    // Find and delete the vault item
    const vaultItem = await VaultItem.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!vaultItem) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Vault item not found",
        },
        { status: 404 }
      );
      return setCorsHeaders(response);
    }

    const response = NextResponse.json({
      success: true,
      message: "Vault item deleted successfully",
    });

    return setCorsHeaders(response);
  } catch (error) {
    console.error("Delete vault item error:", error);
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
