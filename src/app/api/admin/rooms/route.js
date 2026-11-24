
import { prisma } from "@/lib/prisma";

async function checkAdmin(adminId) {
  if (!adminId) return false;

  const user = await prisma.user.findUnique({
    where: { id: adminId },
  });

  return user?.role === "ADMIN";
}

// GET: Fetch all rooms
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get("adminId");

    if (!(await checkAdmin(adminId))) {
      return Response.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    const rooms = await prisma.room.findMany({
      orderBy: { createdAt: "desc" },
    });

    return Response.json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}

// POST: Add a new room
export async function POST(request) {
  try {
    const { adminId, name, description, capacity, amenities } =
      await request.json();

    if (!(await checkAdmin(adminId))) {
      return Response.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    if (!name?.trim() || !Number.isInteger(Number(capacity)) || Number(capacity) < 1) {
      return Response.json(
        { message: "Valid room name and capacity are required" },
        { status: 400 }
      );
    }

    const room = await prisma.room.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        capacity: Number(capacity),
        amenities: Array.isArray(amenities) ? amenities : [],
      },
    });

    return Response.json({
      success: true,
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to create room" },
      { status: 500 }
    );
  }
}
