import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ExpenseItem = {
  id: string;
  title: string;
  amount: number;
  category: string | null;
};

export default async function HomePage() {
  const expenses =
    await prisma.expense.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div className="max-w-7xl mx-auto p-6 pt-[100px]">
      <h1 className="text-4xl font-bold mb-8">
        Public Travel Expenses
      </h1>

      {expenses.length === 0 ? (
        <div className="border rounded-2xl p-8 text-center text-zinc-500">
          No expenses found
        </div>
      ) : (
        <div className="grid gap-4">
          {expenses.map(
            (expense: ExpenseItem) => (
              <div
                key={expense.id}
                className="
                  border
                  border-zinc-800
                  rounded-2xl
                  p-5
                  bg-zinc-900
                "
              >
                <h2 className="font-bold text-xl">
                  {expense.title}
                </h2>

                <p className="mt-2 text-green-500 font-semibold">
                  ₹{expense.amount}
                </p>

                <p className="mt-1 text-zinc-400">
                  {expense.category ||
                    "Uncategorized"}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}