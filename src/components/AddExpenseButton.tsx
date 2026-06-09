"use client";

import { useState } from "react";
import AddExpense from "./AddExpense";

export default function AddExpenseButton({
  tripId,
  members,
}: {
  tripId: string;
  members: any[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          w-full
          py-3
          rounded-xl
          bg-gradient-to-r
          from-green-600
          to-emerald-500
          text-white
          font-semibold
          mb-3
        "
      >
        + Add Expense
      </button>

      {open && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            bg-black/60
            flex
            items-center
            justify-center
            p-4
          "
        >
          <div
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-2xl
              w-full
              max-w-lg
              max-h-[90vh]
              overflow-y-auto
              p-4
            "
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Add Expense</h2>

              <button
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <AddExpense tripId={tripId} members={members} />
          </div>
        </div>
      )}
    </>
  );
}