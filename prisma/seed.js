
import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";

async function main() {
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const employeePassword = await bcrypt.hash("Employee@123", 10);
  const employee2Password = await bcrypt.hash("Employee2@123", 10);

  // Create Admin
  await prisma.user.upsert({
    where: {
      email: "admin@roomsync.com",
    },
    update: {
  name: "RoomSync Admin",
  passwordHash: adminPassword,
  role: "ADMIN",
},
    create: {
      name: "RoomSync Admin",
      email: "admin@roomsync.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  // Create Employee
  await prisma.user.upsert({
    where: {
      email: "employee@roomsync.com",
    },
    update: {
  name: "Test Employee",
  passwordHash: employeePassword,
  role: "EMPLOYEE",
},
    create: {
      name: "Test Employee",
      email: "employee@roomsync.com",
      passwordHash: employeePassword,
      role: "EMPLOYEE",
    },
  });

  await prisma.user.upsert({
  where: {
    email: "employee2@roomsync.com",
  },
  update: {
    name: "Second Employee",
    passwordHash: employee2Password,
    role: "EMPLOYEE",
  },
  create: {
    name: "Second Employee",
    email: "employee2@roomsync.com",
    passwordHash: employee2Password,
    role: "EMPLOYEE",
  },
});

  // Create Rooms
  const rooms = [
    {
      name: "Room A",
      description: "Large meeting Room",
      capacity: 12,
      amenities: ["Projector", "Whiteboard", "WiFi"],
    },
    {
      name: "Room B",
      description: "Medium meeting Room",
      capacity: 6,
      amenities: ["TV", "Whiteboard", "WiFi"],
    },
    {
      name: "Room C",
      description: "Small meeting Room",
      capacity: 3,
      amenities: ["TV", "Whiteboard", "WiFi"],
    },
  ];

  for (const room of rooms) {
    const existingRoom = await prisma.room.findFirst({
      where: {
        name: room.name,
      },
    });

    if (!existingRoom) {
      await prisma.room.create({
        data: room,
      });
    }
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
