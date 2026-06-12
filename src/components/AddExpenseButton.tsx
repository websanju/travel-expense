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
         w-full mb-3 py-2 rounded-[8px] text-[14px] text-white bg-gradient-to-r from-green-500 to-emerald-600  transition disabled:opacity-50 disabled:cursor-not-allowed
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
              bg-zinc-900 relative
              border
              border-zinc-800
              rounded-[8px]
              w-full
              max-w-lg
              max-h-[90vh]
              overflow-y-auto
              p-4
            "
          >
            <div className="flex justify-end items-center ">

              <button
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-white absolute top-2"
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