"use client";

import { useState } from "react";

type Member = {
  id: string;
  name: string;
  type: "participant" | "member";
};

export default function AddExpense({
  tripId,
  members,
}: {
  tripId: string;
  members: Member[];
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidById, setPaidById] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function addExpense() {
    if (
      !title.trim() ||
      !amount ||
      !paidById
    ) {
      alert(
        "Please fill all fields"
      );
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `/api/trips/${tripId}/expenses`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title,
            amount,
            paidById,
          }),
        }
      );

      if (!res.ok) {
        const text =
          await res.text();

        alert(text);
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to add expense"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="
            w-8
            h-8
           rounded-[8px]
            bg-gradient-to-br
            from-green-500
            to-emerald-600
            flex
            items-center
            justify-center
            text-xl
          "
        >
          💰
        </div>

        <div>
          <h2 className="text-[14px] font-bold">
            Add Expense
          </h2>

          <p className="text-zinc-500 text-[12px]">
            Record a new expense for
            this trip
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Expense Name */}
        <input
          className="
            w-full
            bg-zinc-800
            border
            border-zinc-700
            rounded-[8px]
            px-2
            py-2
            text-white
            placeholder-zinc-500
            focus:outline-none
            focus:border-green-500
          "
          placeholder="Expense Name"
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
        />

        {/* Amount */}
        <input
          type="number"
          className="
            w-full
            bg-zinc-800
            border
            border-zinc-700
            rounded-[8px]
           px-2
            py-2
            text-white
            placeholder-zinc-500
            focus:outline-none
            focus:border-green-500
          "
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(
              e.target.value
            )
          }
        />

        {/* Paid By */}
        <select
          className="
            w-full
            bg-zinc-800
            border
            border-zinc-700
            rounded-[8px]
           px-2
            py-2
            text-white
            focus:outline-none
            focus:border-green-500
          "
          value={paidById}
          onChange={(e) =>
            setPaidById(
              e.target.value
            )
          }
        >
          <option value="">
            Who Paid?
          </option>

          {members.map(
            (member) => (
              <option
                key={`${member.type}-${member.id}`}
                value={`${member.type}:${member.id}`}
              >
                {member.name}
              </option>
            )
          )}
        </select>

        {/* Button */}
        <button
          onClick={addExpense}
          disabled={loading}
          className="
            w-full
            py-2
            rounded-[8px]
            text-white
            font-semibold
            bg-gradient-to-r
            from-green-500
            to-emerald-600
            hover:scale-[1.01]
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
            text-[14px]
          "
        >
          {loading
            ? "Adding Expense..."
            : "Add Expense"}
        </button>
      </div>
    </div>
  );
}