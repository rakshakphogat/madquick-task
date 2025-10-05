import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
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

    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Name, email, and password are required",
        },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    if (password.length < 6) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long",
        },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const response = NextResponse.json(
        {
          success: false,
          message: "User with this email already exists",
        },
        { status: 409 }
      );
      return setCorsHeaders(response);
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    // Create response with cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );

    setAuthCookie(response, token);
    return setCorsHeaders(response);
  } catch (error) {
    console.error("Signup error:", error);
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
