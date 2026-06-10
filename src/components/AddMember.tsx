"use client";

import { useState } from "react";

export default function AddMember({
  tripId,
}: {
  tripId: string;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] =
    useState(false);

  async function addMember() {
    if (!name.trim()) {
      alert("Enter member name");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `/api/trips/${tripId}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
          }),
        }
      );

      if (!res.ok) {
        const errorText =
          await res.text();

        alert(
          `Status: ${res.status}\n\n${errorText}`
        );

        return;
      }

      setName("");

      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-xl">
          👥
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            Add Friend
          </h2>

          <p className="text-zinc-500 text-sm">
            Invite people to join this trip
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <input
          className="
            w-full
            bg-zinc-800
            border
            border-zinc-700
           rounded-[8px]
            px-4
            py-4
            text-white
            placeholder-zinc-500
            focus:outline-none
            focus:border-violet-500
          "
          placeholder="Enter friend name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <button
          onClick={addMember}
          disabled={loading}
          className="
            w-full
            py-4
            rounded-[8px]
            bg-gradient-to-r
            from-violet-600
            to-blue-600
            text-white
            font-semibold
            hover:scale-[1.01]
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {loading
            ? "Adding Friend..."
            : "Add Friend"}
        </button>
      </div>
    </div>
  );
}