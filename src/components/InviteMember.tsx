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
    <div className="bg-zinc-900 border border-zinc-800 rounded-[16px] p-3 mb-3">
       <h3 className="text-[14px] mb-3">
        Invite Member
      </h3>
<div className="flex flex-col md:flex-row gap-2">
      <input
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        placeholder="anil@gmail.com"
        className=" flex-1 bg-zinc-800 border border-zinc-700 rounded-[8px] px-4 py-2 outline-none focus:border-purple-500  "
      />

      <button
        onClick={invite}
        className=" bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-white font-semibold disabled:opacity-50 text-[14px] rounded-[8px] w-full  "
      >
        Invite
      </button>
      </div>
    </div>
  );
}