
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { title, roomId, userId, startTime, endTime } =
      await request.json();

    if (!title || !roomId || !userId || !startTime || !endTime) {
      return Response.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (
      isNaN(start.getTime()) ||
      isNaN(end.getTime()) ||
      start <= now
    ) {
      return Response.json(
        { message: "Invalid or past booking time" },
        { status: 400 }
      );
    }

    const duration = (end - start) / 60000;

    if (duration < 15 || duration > 240) {
      return Response.json(
        { message: "Booking must be 15 minutes to 4 hours" },
        { status: 400 }
      );
    }

    if (
      start.getMinutes() % 15 !== 0 ||
      end.getMinutes() % 15 !== 0 ||
      start.getSeconds() !== 0 ||
      end.getSeconds() !== 0
    ) {
      return Response.json(
        { message: "Use 15-minute time intervals" },
        { status: 400 }
      );
    }

    if (
      start.getHours() < 8 ||
      end.getHours() > 20 ||
      (end.getHours() === 20 && end.getMinutes() > 0) ||
      start.toDateString() !== end.toDateString()
    ) {
      return Response.json(
        { message: "Bookings must be between 08:00 and 20:00 on the same day" },
        { status: 400 }
      );
    }

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);

    if (start > maxDate) {
      return Response.json(
        { message: "Bookings cannot be more than 30 days ahead" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!user || !room || !room.isActive) {
      return Response.json(
        { message: "User or active room not found" },
        { status: 404 }
      );
    }

    if (user.role === "EMPLOYEE") {
      const upcomingCount = await prisma.booking.count({
        where: {
          userId,
          status: "CONFIRMED",
          startTime: { gt: now },
        },
      });

      if (upcomingCount >= 3) {
        return Response.json(
          { message: "Maximum 3 upcoming bookings allowed" },
          { status: 400 }
        );
      }
    }

    const conflict = await prisma.booking.findFirst({
      where: {
        roomId,
        status: "CONFIRMED",
        startTime: { lt: end },
        endTime: { gt: start },
      },
    });

    if (conflict) {
      return Response.json(
        { message: "Room is already booked for this time" },
        { status: 409 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        title,
        roomId,
        userId,
        startTime: start,
        endTime: end,
      },
    });

    return Response.json(
      { success: true, booking },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to create booking" },
      { status: 500 }
    );
  }
}
