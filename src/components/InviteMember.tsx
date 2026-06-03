"use client";

import { useState } from "react";

export default function InviteMember({
  tripId,
}: {
  tripId: string;
}) {
  const [email, setEmail] =
    useState("");

  async function invite() {
    const res = await fetch(
      `/api/trips/${tripId}/invite`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Member invited");

    setEmail("");
  }

  return (
    <div className=" rounded p-5 mt-6 bg-zinc-800 rounded-2xl p-5">
      <h2 className="font-bold mb-3">
        Invite Member
      </h2>

      <input
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        placeholder="anil@gmail.com"
        className=" w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 mb-4"
      />

      <button
        onClick={invite}
        className=" w-full py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.01] transition disabled:opacity-50 disabled:cursor-not-allowed "
      >
        Invite
      </button>
    </div>
  );
}