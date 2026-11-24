
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
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
