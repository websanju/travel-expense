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
          text-white
          px-1
          py-1
          rounded-lg
          text-[10px]
        "
      >
       <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM10.95 17.51C10.66 17.8 10.11 18.08 9.71 18.14L7.25 18.49C7.16 18.5 7.07 18.51 6.98 18.51C6.57 18.51 6.19 18.37 5.92 18.1C5.59 17.77 5.45 17.29 5.53 16.76L5.88 14.3C5.94 13.89 6.21 13.35 6.51 13.06L10.97 8.6C11.05 8.81 11.13 9.02 11.24 9.26C11.34 9.47 11.45 9.69 11.57 9.89C11.67 10.06 11.78 10.22 11.87 10.34C11.98 10.51 12.11 10.67 12.19 10.76C12.24 10.83 12.28 10.88 12.3 10.9C12.55 11.2 12.84 11.48 13.09 11.69C13.16 11.76 13.2 11.8 13.22 11.81C13.37 11.93 13.52 12.05 13.65 12.14C13.81 12.26 13.97 12.37 14.14 12.46C14.34 12.58 14.56 12.69 14.78 12.8C15.01 12.9 15.22 12.99 15.43 13.06L10.95 17.51ZM17.37 11.09L16.45 12.02C16.39 12.08 16.31 12.11 16.23 12.11C16.2 12.11 16.16 12.11 16.14 12.1C14.11 11.52 12.49 9.9 11.91 7.87C11.88 7.76 11.91 7.64 11.99 7.57L12.92 6.64C14.44 5.12 15.89 5.15 17.38 6.64C18.14 7.4 18.51 8.13 18.51 8.89C18.5 9.61 18.13 10.33 17.37 11.09Z" fill="#ffffff"></path> </g></svg>
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
                  rounded-[8px]
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
                 rounded-[8px]
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
                 rounded-[8px]
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
                    rounded-[8px]
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
                    rounded-[8px]
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