import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$connect();

    const users = await prisma.user.count();

    return Response.json({
      success: true,
      message: "Database Connected!",
      totalUsers: users,
    });
  } catch (error) {
    console.error("Database error", error);

    return Response.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 },
    );
  }
}
