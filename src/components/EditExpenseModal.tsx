"use client";

import { useState } from "react";

type Member = {
  id: string;
  name: string;
  type: "participant" | "member";
};

type Expense = {
  id: string;
  title: string;
  amount: number;
};

export default function EditExpenseModal({
  tripId,
  expense,
  members,
}: {
  tripId: string;
  expense: Expense;
  members: Member[];
}) {
  const [open, setOpen] =
    useState(false);

  const [title, setTitle] =
    useState(expense.title);

  const [amount, setAmount] =
    useState(
      expense.amount.toString()
    );

  const [paidById, setPaidById] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function updateExpense() {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/trips/${tripId}/expenses/${expense.id}`,
        {
          method: "PATCH",
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

      setOpen(false);

      window.location.reload();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update expense"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() =>
          setOpen(true)
        }
        className="
          bg-blue-600
          text-white
          px-3
          py-1
          rounded-lg
          text-sm
        "
      >
        Edit
      </button>

      {open && (
        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/60
            flex
            items-center
            justify-center
            p-4
          "
        >
          <div
            className="
              w-full
              max-w-lg
              bg-zinc-900
              border
              border-zinc-800
              rounded-3xl
              p-6
            "
          >
            <h2 className="text-2xl font-bold mb-5">
              Edit Expense
            </h2>

            <div className="space-y-4">
              <input
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="Expense Name"
                className="
                  w-full
                  bg-zinc-800
                  border
                  border-zinc-700
                  rounded-2xl
                  px-4
                  py-3
                "
              />

              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                placeholder="Amount"
                className="
                  w-full
                  bg-zinc-800
                  border
                  border-zinc-700
                  rounded-2xl
                  px-4
                  py-3
                "
              />

              <select
                value={paidById}
                onChange={(e) =>
                  setPaidById(
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-zinc-800
                  border
                  border-zinc-700
                  rounded-2xl
                  px-4
                  py-3
                "
              >
                <option value="">
                  Change Payer
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

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setOpen(false)
                  }
                  className="
                    flex-1
                    py-3
                    rounded-2xl
                    bg-zinc-800
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={
                    updateExpense
                  }
                  disabled={
                    loading
                  }
                  className="
                    flex-1
                    py-3
                    rounded-2xl
                    bg-green-600
                    text-white
                    font-semibold
                  "
                >
                  {loading
                    ? "Saving..."
                    : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}