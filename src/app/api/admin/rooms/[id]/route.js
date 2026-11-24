
import { prisma } from "@/lib/prisma";

async function checkAdmin(adminId) {
  if (!adminId) return false;

  const user = await prisma.user.findUnique({
    where: { id: adminId },
  });

  return user?.role === "ADMIN";
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;

    const {
      adminId,
      name,
      description,
      capacity,
      amenities,
      isActive,
    } = await request.json();

    if (!(await checkAdmin(adminId))) {
      return Response.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    const existingRoom = await prisma.room.findUnique({
      where: { id },
    });

    if (!existingRoom) {
      return Response.json(
        { message: "Room not found" },
        { status: 404 }
      );
    }

    const updateData = {};

    if (name !== undefined) {
      if (!name.trim()) {
        return Response.json(
          { message: "Room name is required" },
          { status: 400 }
        );
      }

      updateData.name = name.trim();
    }

    if (description !== undefined) {
      updateData.description = description.trim() || null;
    }

    if (capacity !== undefined) {
      if (!Number.isInteger(Number(capacity)) || Number(capacity) < 1) {
        return Response.json(
          { message: "Invalid capacity" },
          { status: 400 }
        );
      }

      updateData.capacity = Number(capacity);
    }

    if (amenities !== undefined) {
      if (!Array.isArray(amenities)) {
        return Response.json(
          { message: "Amenities must be an array" },
          { status: 400 }
        );
      }

      updateData.amenities = amenities;
    }

    if (typeof isActive === "boolean") {
      updateData.isActive = isActive;
    }

    const room = await prisma.room.update({
      where: { id },
      data: updateData,
    });

    return Response.json({
      success: true,
      message: "Room updated successfully",
      room,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to update room" },
      { status: 500 }
    );
  }
}
