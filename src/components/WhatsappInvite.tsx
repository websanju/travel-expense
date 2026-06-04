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
    <div>
      <h3 className="font-bold mb-3">
        Invite via WhatsApp
      </h3>

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
           w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 mb-4
        "
      />

      <button
        onClick={shareInvite}
        className="
          bg-green-600
          hover:bg-green-700
          text-white
          px-4
          py-3
          rounded-xl
          w-full
        "
      >
         Share on WhatsApp
      </button>
    </div>
  );
}