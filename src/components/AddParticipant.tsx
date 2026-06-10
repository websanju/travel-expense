"use client";

import { useState } from "react";

type UserResult = {
  id: string;
  name: string | null;
  email: string;
  phone: string;
};

type ExistingParticipant = {
  userId: string;
};

export default function AddParticipant({
  tripId,
  participants,
  currentUserId,
}: {
  tripId: string;
  participants: ExistingParticipant[];
  currentUserId: string;
}) {
  const [phone, setPhone] =
    useState("");

  const [users, setUsers] =
    useState<UserResult[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function searchUsers() {
    if (!phone.trim()) {
      setMessage(
        "Please enter a phone number"
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `/api/users/search?phone=${phone}`
      );

      const data =
        (await res.json()) as UserResult[];

      setUsers(data);

      if (data.length === 0) {
        setMessage(
          "❌ No user found with this phone number"
        );
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "❌ Failed to search users"
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
        (await res.json()) as {
          error?: string;
        };

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
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-3">
      <div className="mb-3">
        <h2 className="text-[18px] font-bold">
          Add Registered User
        </h2>

        <p className="text-zinc-500 text-sm mt-0">
          Search by phone number
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-2">
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
            rounded-[8px]
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
            py-2
            rounded-[8px]
            bg-purple-600
            text-white
            font-semibold
            disabled:opacity-50
          "
        >
          {loading
            ? "Searching..."
            : "Search"}
        </button>
      </div>

      {message && (
        <div
          className="
            mt-4
            p-3
            rounded-xl
            bg-zinc-800
            border
            border-zinc-700
            text-sm
          "
        >
          {message}
        </div>
      )}

      {users.length > 0 && (
        <div className="mt-6 space-y-3">
          {users.map((user) => {
            const alreadyAdded =
              participants.some(
                (
                  participant
                ) =>
                  participant.userId ===
                  user.id
              );

            return (
              <div
                key={user.id}
                className="
                  flex
                  items-center
                  justify-between
                  border
                  border-zinc-800
                 rounded-[8px]
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

                {user.id ===
                currentUserId ? (
                  <span
                    className="
                      px-4
                      py-2
                      rounded-xl
                      bg-purple-500/20
                      text-purple-400
                      font-medium
                    "
                  >
                    🙋 This is you
                  </span>
                ) : alreadyAdded ? (
                  <span
                    className="
                      px-4
                      py-2
                      rounded-xl
                      bg-zinc-700
                      text-zinc-300
                      font-medium
                    "
                  >
                    ✅ Already Added
                  </span>
                ) : (
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
                      hover:bg-green-700
                      text-white
                      font-medium
                    "
                  >
                    Add
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}