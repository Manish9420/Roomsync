"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeDashboard() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      router.push("/");
      return;
    }

    const parsedUser = JSON.parse(savedUser);

    if (parsedUser.role !== "EMPLOYEE") {
      router.push("/");
      return;
    }

    setUser(parsedUser);
    fetchRooms();
  }, [router]);

  async function fetchRooms() {
    try {
      const response = await fetch("/api/rooms");
      const data = await response.json();

      if (response.ok) {
        setRooms(data.rooms);
      }
    } catch (error) {
      console.error("Failed to load rooms:", error);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("user");
    router.push("/");
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white px-8 py-5">
        <h1 className="text-2xl font-bold">RoomSync</h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.name}</span>

          <button
            onClick={logout}
            className="rounded-lg bg-black px-4 py-2 text-sm text-white"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Meeting Rooms</h2>

            <p className="mt-2 text-gray-500">
              Find a room for your next meeting.
            </p>
          </div>

          <button
            onClick={() => router.push("/employee/bookings")}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            My Bookings
          </button>
        </div>

        {loading ? (
          <p>Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <p>No active meeting rooms available.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold">{room.name}</h3>

                <p className="mt-2 text-sm text-gray-500">{room.description}</p>

                <p className="mt-4 text-sm font-medium">
                  Capacity: {room.capacity} people
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                <button
                  className="mt-6 w-full rounded-lg bg-black py-2.5 text-white"
                  onClick={() =>
                    router.push(`/employee/book?roomId=${room.id}`)
                  }
                >
                  Book Room
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
