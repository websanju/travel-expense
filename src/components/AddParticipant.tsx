"use client";

import { useState } from "react";

type UserResult = {
  id: string;
  name: string | null;
  email: string;
  phone: string;
};

export default function AddParticipant({
  tripId,
}: {
  tripId: string;
}) {
  const [phone, setPhone] =
    useState("");

  const [users, setUsers] =
    useState<UserResult[]>([]);

  const [loading, setLoading] =
    useState(false);

  async function searchUsers() {
    if (!phone.trim()) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `/api/users/search?phone=${phone}`
      );

      const data =
        await res.json();

      setUsers(data);
    } catch (error) {
      console.error(error);
      alert(
        "Failed to search users"
      );
    } finally {
      setLoading(false);
    }
  }

  async function addToTrip(
    userId: string
  ) {
    try {
      const res = await fetch(
        `/api/trips/${tripId}/participants`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            userId,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        alert(
          data.error ||
            "Failed to add user"
        );
        return;
      }

      alert(
        "User added successfully"
      );

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert(
        "Something went wrong"
      );
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-6">
      <div className="mb-5">
        <h2 className="text-2xl font-bold">
          Add Registered User
        </h2>

        <p className="text-zinc-500 text-sm mt-1">
          Search by phone number
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="tel"
          value={phone}
          onChange={(e) =>
            setPhone(
              e.target.value
            )
          }
          placeholder="9876543210"
          className="
            flex-1
            bg-zinc-800
            border
            border-zinc-700
            rounded-2xl
            px-4
            py-3
            outline-none
            focus:border-purple-500
          "
        />

        <button
          onClick={searchUsers}
          disabled={loading}
          className="
            px-6
            py-3
            rounded-2xl
            bg-purple-600
            text-white
            font-semibold
          "
        >
          {loading
            ? "Searching..."
            : "Search"}
        </button>
      </div>

      {users.length > 0 && (
        <div className="mt-6 space-y-3">
          {users.map(
            (user) => (
              <div
                key={user.id}
                className="
                  flex
                  items-center
                  justify-between
                  border
                  border-zinc-800
                  rounded-2xl
                  p-4
                "
              >
                <div>
                  <div className="font-semibold">
                    {user.name ??
                      "Unnamed User"}
                  </div>

                  <div className="text-sm text-zinc-500">
                    {user.email}
                  </div>

                  <div className="text-sm text-zinc-500">
                    {user.phone}
                  </div>
                </div>

                <button
                  onClick={() =>
                    addToTrip(
                      user.id
                    )
                  }
                  className="
                    px-4
                    py-2
                    rounded-xl
                    bg-green-600
                    text-white
                    font-medium
                  "
                >
                  Add
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}