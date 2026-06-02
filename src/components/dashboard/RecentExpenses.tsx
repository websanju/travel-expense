// src/components/dashboard/RecentExpenses.tsx

type RecentExpense = {
  id: string;
  title: string;
  amount: number;
  tripTitle: string;
};

export default function RecentExpenses({
  expenses,
}: {
  expenses: RecentExpense[];
}) {
  return (
    <div className="bg-zinc-900 rounded-3xl p-5">
      <h2 className="text-xl font-bold mb-4">
        Recent Expenses
      </h2>

      <div className="space-y-3">
        {expenses.map(
          (expense: RecentExpense) => (
            <div
              key={expense.id}
              className="flex justify-between border-b border-zinc-800 pb-3"
            >
              <div>
                <div>
                  {expense.title}
                </div>

                <div className="text-xs text-zinc-500">
                  {expense.tripTitle}
                </div>
              </div>

              <div className="font-semibold">
                ₹{expense.amount}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}