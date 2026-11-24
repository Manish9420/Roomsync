"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function BookRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const roomId = searchParams.get("roomId");

  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      router.push("/");
      return;
    }

    setUser(JSON.parse(savedUser));
    fetchRoom();
  }, [router]);

  async function fetchRoom() {
    const response = await fetch("/api/rooms");
    const data = await response.json();

    if (response.ok) {
      const selectedRoom = data.rooms.find((item) => item.id === roomId);

      setRoom(selectedRoom || null);
    }
  }

  async function handleBooking(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          roomId,
          userId: user.id,
          startTime: `${date}T${startTime}:00`,
          endTime: `${date}T${endTime}:00`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Booking failed");
        return;
      }

      setMessage("Booking confirmed successfully!");

      setTimeout(() => {
        router.push("/employee");
      }, 1200);
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;
  async function checkAvailability(date) {
    if (!date || !roomId) return;

    const response = await fetch(
      `/api/availability?roomId=${roomId}&date=${date}`,
    );

    const data = await response.json();

    if (response.ok) {
      setAvailability(data.bookings);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-xl rounded-xl border bg-white p-8 shadow-sm">
        <button
          onClick={() => router.back()}
          className="mb-6 text-sm text-gray-500"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold">Book Meeting Room</h1>

        {room ? (
          <p className="mt-2 text-gray-500">Selected room: {room.name}</p>
        ) : (
          <p className="mt-2 text-red-600">Room not found or inactive.</p>
        )}

        <form onSubmit={handleBooking} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Meeting Title
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="Team meeting"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Booking Date
            </label>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                checkAvailability(e.target.value);
                setDate(e.target.value);
              }}
              className="w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>
          {availability.length > 0 && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3">
              <h3 className="mb-2 text-sm font-semibold text-red-700">
                Already Booked Slots
              </h3>

              {availability.map((booking) => (
                <div key={booking.id} className="mb-2 text-sm text-red-600">
                  {booking.title}:{" "}
                  {new Date(booking.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" - "}
                  {new Date(booking.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              ))}
            </div>
          )}

          {selectedDate && availability.length === 0 && (
            <p className="text-sm text-green-600">
              No bookings found for this date. Room is available.
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Start Time
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">End Time</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>
          </div>

          {message && <p className="text-sm text-blue-600">{message}</p>}

          <button
            type="submit"
            disabled={loading || !room}
            className="w-full rounded-lg bg-black p-3 text-white disabled:opacity-50"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </main>
  );
}
export default function BookRoomPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading booking page...</div>}>
      <BookRoomContent />
    </Suspense>
  );
}
