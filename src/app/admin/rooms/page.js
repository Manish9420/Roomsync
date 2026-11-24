
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminRooms() {
  const [editingRoom, setEditingRoom] = useState(null);
  const router = useRouter();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [amenities, setAmenities] = useState("");
  const [message, setMessage] = useState("");

  const [adminId, setAdminId] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "ADMIN") {
      router.push("/");
      return;
    }

    setAdminId(user.id);
    fetchRooms(user.id);
  }, [router]);

  async function fetchRooms(id) {
    try {
      const response = await fetch(
        `/api/admin/rooms?adminId=${id}`
      );

      const data = await response.json();

      if (data.success) {
        setRooms(data.rooms);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  }

  async function addRoom(event) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/admin/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId,
          name,
          description,
          capacity: Number(capacity),
          amenities: amenities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Room added successfully");
        setName("");
        setDescription("");
        setCapacity("");
        setAmenities("");
        fetchRooms(adminId);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to add room");
    }
  }


async function updateRoom(roomId, updates) {
  try {
    const response = await fetch(`/api/admin/rooms/${roomId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        adminId,
        ...updates,
      }),
    });

    const data = await response.json();

    if (data.success) {
      setEditingRoom(null);
      setMessage("Room updated successfully");
      fetchRooms(adminId);
    } else {
      setMessage(data.message);
    }
  } catch (error) {
    console.error(error);
    setMessage("Failed to update room");
  }
}

function startEditing(room) {
  setEditingRoom({
    ...room,
    amenities: room.amenities.join(", "),
  });
}


  if (loading) {
    return <p className="p-8">Loading rooms...</p>;
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

        <h1 className="mb-2 text-3xl font-bold">
          Room Management
        </h1>

        <p className="mb-8 text-gray-500">
          Add and manage meeting rooms.
        </p>

        <div className="mb-8 rounded-xl border bg-white p-6">
          <h2 className="mb-5 text-xl font-semibold">
            Add New Room
          </h2>

          <form onSubmit={addRoom} className="space-y-4">

            <input
              type="text"
              placeholder="Room name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-md border p-3"
            />

            <textarea
              placeholder="Room description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border p-3"
            />

            <input
              type="number"
              placeholder="Capacity"
              min="1"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
              className="w-full rounded-md border p-3"
            />

            <input
              type="text"
              placeholder="Amenities (comma separated)"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              className="w-full rounded-md border p-3"
            />

            <button
              type="submit"
              className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Room
            </button>
          </form>

          {message && (
            <p className="mt-4 text-sm text-gray-600">
              {message}
            </p>
          )}
        </div>


{editingRoom && (
  <div className="mb-8 rounded-xl border bg-white p-6">
    <h2 className="mb-5 text-xl font-semibold">Edit Room</h2>

    <form
      onSubmit={(event) => {
        event.preventDefault();

        updateRoom(editingRoom.id, {
          name: editingRoom.name,
          description: editingRoom.description,
          capacity: Number(editingRoom.capacity),
          amenities: editingRoom.amenities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        });
      }}
      className="space-y-4"
    >
      <input
        value={editingRoom.name}
        onChange={(e) =>
          setEditingRoom({ ...editingRoom, name: e.target.value })
        }
        required
        className="w-full rounded-md border p-3"
        placeholder="Room name"
      />

      <textarea
        value={editingRoom.description || ""}
        onChange={(e) =>
          setEditingRoom({ ...editingRoom, description: e.target.value })
        }
        className="w-full rounded-md border p-3"
        placeholder="Description"
      />

      <input
        type="number"
        min="1"
        value={editingRoom.capacity}
        onChange={(e) =>
          setEditingRoom({ ...editingRoom, capacity: e.target.value })
        }
        required
        className="w-full rounded-md border p-3"
        placeholder="Capacity"
      />

      <input
        value={editingRoom.amenities}
        onChange={(e) =>
          setEditingRoom({ ...editingRoom, amenities: e.target.value })
        }
        className="w-full rounded-md border p-3"
        placeholder="Amenities (comma separated)"
      />

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Save Changes
        </button>

        <button
          type="button"
          onClick={() => setEditingRoom(null)}
          className="rounded-md border px-4 py-2 text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
)}

        <h2 className="mb-4 text-xl font-semibold">
          All Rooms ({rooms.length})
        </h2>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold">
                  {room.name}
                </h3>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    room.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {room.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {room.description || "No description"}
              </p>

              <p className="mt-3 text-sm font-medium">
                Capacity: {room.capacity} people
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {room.amenities.map((item, index) => (
                  <span
                    key={index}
                    className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600"
                  >
                    {item}
                  </span>
                ))}
              </div>

<div className="mt-5 flex gap-2">
  <button
    onClick={() => startEditing(room)}
    className="rounded-md border px-3 py-2 text-sm hover:bg-gray-100"
  >
    Edit
  </button>

  <button
    onClick={() =>
      updateRoom(room.id, { isActive: !room.isActive })
    }
    className={`rounded-md px-3 py-2 text-sm text-white ${
      room.isActive
        ? "bg-red-600 hover:bg-red-700"
        : "bg-green-600 hover:bg-green-700"
    }`}
  >
    {room.isActive ? "Deactivate" : "Activate"}
  </button>
</div>

            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
