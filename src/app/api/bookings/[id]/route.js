
import { prisma } from "@/lib/prisma";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { userId } = await request.json();

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

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return Response.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    const isOwner = booking.userId === userId;
    const isAdmin = user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return Response.json(
        { message: "You are not allowed to cancel this booking" },
        { status: 403 }
      );
    }

    if (booking.status === "CANCELLED") {
      return Response.json(
        { message: "Booking is already cancelled" },
        { status: 400 }
      );
    }

    await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return Response.json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
