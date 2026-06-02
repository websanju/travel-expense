"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewTrip() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [destination, setDestination] =
    useState("");
  const [loading, setLoading] =
    useState(false);

  async function createTrip() {
    if (!title.trim()) {
      alert("Please enter trip name");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          title,
          destination,
          startDate:
            new Date().toISOString(),
          endDate:
            new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.error ||
            "Failed to create trip"
        );
        return;
      }

      setTitle("");
      setDestination("");

      router.push(
        `/trips/${data.id}`
      );
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-xl mx-auto px-6 pt-[120px] pb-28">

        {/* Header */}
        <div className="mb-10">
          <div
            className="
              w-20
              h-20
              rounded-3xl
              bg-gradient-to-br
              from-violet-600
              to-blue-600
              flex
              items-center
              justify-center
              text-4xl
              shadow-lg
              mb-5
            "
          >
            ✈️
          </div>

          <h1 className="text-4xl font-bold text-white">
            Create New Trip
          </h1>

          <p className="text-zinc-400 mt-2">
            Plan your journey and start
            tracking expenses with friends.
          </p>
        </div>

        {/* Card */}
        <div
          className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-[32px]
            p-6
            shadow-2xl
          "
        >
          {/* Trip Name */}
          <div className="mb-5">
            <label className="block text-zinc-400 text-sm mb-2">
              Trip Name
            </label>

            <input
              className="
                w-full
                bg-zinc-800
                border
                border-zinc-700
                rounded-2xl
                px-4
                py-4
                text-white
                placeholder-zinc-500
                focus:outline-none
                focus:border-violet-500
              "
              placeholder="Goa Trip"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
            />
          </div>

          {/* Destination */}
          <div className="mb-6">
            <label className="block text-zinc-400 text-sm mb-2">
              Destination
            </label>

            <input
              className="
                w-full
                bg-zinc-800
                border
                border-zinc-700
                rounded-2xl
                px-4
                py-4
                text-white
                placeholder-zinc-500
                focus:outline-none
                focus:border-blue-500
              "
              placeholder="Goa, India"
              value={destination}
              onChange={(e) =>
                setDestination(
                  e.target.value
                )
              }
            />
          </div>

          {/* Create Button */}
          <button
            onClick={createTrip}
            disabled={loading}
            className="
              w-full
              py-4
              rounded-2xl
              text-white
              font-semibold
              bg-gradient-to-r
              from-violet-600
              to-blue-600
              hover:scale-[1.02]
              transition-all
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >{loading?"Creating Trip...":"Create Trip"}</button>
        </div>

        {/* Footer Text */}
        <div className="mt-6 text-center text-sm text-zinc-500">
  After creating the trip,
  you&apos;ll be redirected to add
  members and expenses.
</div>
      </div>
    </div>
  );
}