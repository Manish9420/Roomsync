
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const roomId = searchParams.get("roomId");
    const date = searchParams.get("date");

    if (!roomId || !date) {
      return Response.json(
        { message: "Room ID and date are required" },
        { status: 400 }
      );
    }

    // Calculate the selected day's boundaries (India time)
    const dayStart = new Date(`${date}T00:00:00+05:30`);
    const nextDay = new Date(dayStart);
    nextDay.setDate(nextDay.getDate() + 1);

    if (isNaN(dayStart.getTime())) {
      return Response.json(
        { message: "Invalid date" },
        { status: 400 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: {
        roomId,
        status: "CONFIRMED",
        startTime: { lt: nextDay },
        endTime: { gt: dayStart },
      },
      select: {
        id: true,
        title: true,
        startTime: true,
        endTime: true,
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
      { message: "Failed to check availability" },
      { status: 500 }
    );
  }
}
