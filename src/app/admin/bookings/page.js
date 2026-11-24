
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminBookings() {
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [adminId, setAdminId] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "ADMIN") {
      router.push("/");
      return;
    }

    setAdminId(user.id);
    fetchBookings(user.id);
  }, [router]);

  async function fetchBookings(id) {
    try {
      const response = await fetch(
        `/api/admin/bookings?adminId=${id}`
      );

      const data = await response.json();

      if (data.success) {
        setBookings(data.bookings);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  async function cancelBooking(bookingId) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/bookings/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: adminId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Booking cancelled successfully");
        fetchBookings(adminId);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to cancel booking");
    }
  }

  if (loading) {
    return <p className="p-8">Loading bookings...</p>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">

        <button
          onClick={() => router.push("/admin")}
          className="mb-6 text-sm font-medium text-blue-600"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-gray-900">
          Booking Management
        </h1>

        <p className="mb-8 mt-2 text-gray-500">
          View and manage all employee bookings.
        </p>

        {message && (
          <p className="mb-4 text-sm text-gray-600">
            {message}
          </p>
        )}

        {bookings.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center">
            <h2 className="font-semibold">
              No bookings found
            </h2>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {booking.title}
                    </h2>

                    <p className="mt-1 text-gray-600">
                      Room: {booking.room.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Employee: {booking.user.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {booking.user.email}
                    </p>

                    <p className="mt-3 text-sm text-gray-500">
                      {new Date(booking.startTime).toLocaleDateString()}
                    </p>

                    <p className="text-sm text-gray-500">
                      {new Date(booking.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" - "}
                      {new Date(booking.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {booking.status}
                    </span>

                    {booking.status === "CONFIRMED" && (
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
