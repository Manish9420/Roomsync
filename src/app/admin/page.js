
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== "ADMIN") {
      router.push("/employee");
      return;
    }

    setAdmin(user);
  }, [router]);

  function logout() {
    localStorage.removeItem("user");
    router.push("/");
  }

  if (!admin) return null;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">

        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-500">
              Welcome, {admin.name}
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">
              Room Management
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Add, edit, activate and deactivate meeting rooms.
            </p>

            <button
              onClick={() => router.push("/admin/rooms")}
              className="mt-6 rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
            >
              Manage Rooms
            </button>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">
              Booking Management
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              View all bookings and cancel any booking.
            </p>

            <button
              onClick={() => router.push("/admin/bookings")}
              className="mt-6 rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
            >
              Manage Bookings
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
