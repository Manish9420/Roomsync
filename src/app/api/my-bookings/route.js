
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId,
        status: "CONFIRMED",
        startTime: {
          gte: new Date(),
        },
      },
      include: {
        room: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return Response.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
