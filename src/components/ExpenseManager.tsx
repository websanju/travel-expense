"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

type Expense = {
  id: string;
  title: string;
  amount: number;
  category?: string | null;
  isPublic?: boolean;
};

export default function ExpenseManager() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadExpenses() {
      try {
        const res = await fetch(
          "/api/my-expenses"
        );

        if (!res.ok) {
          return;
        }

        const data: Expense[] =
          await res.json();

        if (!cancelled) {
          setExpenses(data);
        }
      } catch (error) {
        console.error(
          "Failed to load expenses",
          error
        );
      }
    }

    void loadExpenses();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAdd(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(
        "/api/expenses",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title,
            amount: Number(amount),
            category,
            isPublic,
          }),
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          alert(
            "Unauthorized — please sign in"
          );
          return;
        }

        alert(
          "Failed to create expense"
        );
        return;
      }

      const json: Expense =
        await res.json();

      setExpenses(
        (
          current: Expense[]
        ) => [json, ...current]
      );

      setTitle("");
      setAmount("");
      setCategory("");
      setIsPublic(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 border rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          My Expenses
        </h2>

        <button
          onClick={() =>
            signOut()
          }
          className="text-sm underline"
        >
          Sign out
        </button>
      </div>

      <form
        onSubmit={handleAdd}
        className="space-y-2 mb-4"
      >
        <input
          className="border p-2 w-full"
          placeholder="Title"
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(
              e.target.value
            )
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Category"
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) =>
              setIsPublic(
                e.target.checked
              )
            }
          />
          Public
        </label>

        <div>
          <button
            className="bg-black text-white px-4 py-2"
            disabled={loading}
          >
            {loading
              ? "Adding..."
              : "Add Expense"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {expenses.map(
          (expense) => (
            <div
              key={expense.id}
              className="p-3 border rounded"
            >
              <div className="font-semibold">
                {expense.title}
              </div>

              <div>
                ₹{expense.amount}
              </div>

              <div className="text-sm text-gray-600">
                {expense.category}
              </div>
            </div>
          )
        )}

        {expenses.length === 0 && (
          <div className="text-sm text-gray-600">
            No expenses yet
          </div>
        )}
      </div>
    </div>
  );
}