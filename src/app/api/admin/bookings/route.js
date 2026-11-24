
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get("adminId");

    if (!adminId) {
      return Response.json(
        { message: "Admin ID is required" },
        { status: 400 }
      );
    }

    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== "ADMIN") {
      return Response.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        room: {
          select: {
            name: true,
            capacity: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
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
