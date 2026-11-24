
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Response.json(
        { message: "Invalid Email or Password" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isValid) {
      return Response.json(
        { message: "Invalid Email or Password" },
        { status: 401 }
      );
    }

    return Response.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      redirectTo:
        user.role === "ADMIN" ? "/admin" : "/employee",
    });

  } catch (error) {
    console.error("Login error:", error);

    return Response.json(
      { message: "Something Went Wrong" },
      { status: 500 }
    );
  }
}
