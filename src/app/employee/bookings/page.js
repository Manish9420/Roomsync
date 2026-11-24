"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MyBookings() {
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "EMPLOYEE") {
      router.push("/");
      return;
    }

    async function fetchBookings() {
      try {
        const response = await fetch(`/api/my-bookings?userId=${user.id}`);

        const data = await response.json();

        if (data.success) {
          setBookings(data.bookings);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [router]);

  if (loading) {
    return <p className="p-8">Loading bookings...</p>;
  }

  async function cancelBooking(bookingId) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) return;

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setBookings((previousBookings) =>
          previousBookings.filter((booking) => booking.id !== bookingId),
        );

        alert("Booking cancelled successfully");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => router.push("/employee")}
          className="mb-6 text-sm font-medium text-blue-600"
        >
          ← Back to Dashboard
        </button>

        <h1 className="mb-2 text-3xl font-bold text-gray-900">My Bookings</h1>

        <p className="mb-8 text-gray-500">
          View your upcoming meeting room bookings.
        </p>

        {bookings.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              No upcoming bookings
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              You haven't booked any meeting rooms yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {booking.title}
                    </h2>

                    <p className="mt-1 text-gray-600">{booking.room.name}</p>

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

                  <span className="h-fit rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    Confirmed
                  </span>

                  <button
                    onClick={() => cancelBooking(booking.id)}
className="self-start rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors">
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
