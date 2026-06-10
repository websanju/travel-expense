"use client";

import { useState } from "react";

export default function WhatsappInvite({
  tripId,
}: {
  tripId: string;
}) {
  const [phone, setPhone] =
    useState("");

  function shareInvite() {
    const inviteUrl =
      `${window.location.origin}/invite/${tripId}`;

    const whatsappUrl =
      `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(
        `✈️ Join my Travel Expense Trip!\n\n${inviteUrl}`
      )}`;

    window.open(
      whatsappUrl,
      "_blank"
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[16px] p-3 mb-3">
      <h3 className="text-[14px] mb-3">
        Invite via WhatsApp
      </h3>
<div className="flex flex-col md:flex-row gap-2">
      <input
        type="tel"
        placeholder="+91 9876543210"
        value={phone}
        onChange={(e) =>
          setPhone(
            e.target.value
          )
        }
        className="
            flex-1 bg-zinc-800 border border-zinc-700 rounded-[8px] px-4 py-2 outline-none focus:border-purple-500 
        "
      />

      <button
        onClick={shareInvite}
        className="
          bg-green-600
          hover:bg-green-700
          text-white
          px-6
          py-2
          text-white font-semibold disabled:opacity-50 text-[14px] rounded-[8px]
          w-full
        "
      >
         Share on WhatsApp
      </button>
      </div>
    </div>
  );
}