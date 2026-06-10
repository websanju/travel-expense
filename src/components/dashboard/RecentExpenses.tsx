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
  if (expenses.length === 0) {
    return null;
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[16px] p-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-bold">
          Recent Expenses
        </h2>

        <span className="text-xs text-zinc-500">
          {expenses.length}
        </span>
      </div>

      <div className="space-y-3">
        {expenses.map(
          (expense: RecentExpense) => (
            <div
              key={expense.id}
              className="
                flex
                items-center
                justify-between
                rounded-[16px]
                bg-zinc-800/50
                p-4
              "
            >
              <div>
                <div className="font-medium">
                  {expense.title}
                </div>

                <div className="text-xs text-zinc-500 mt-1">
                  {expense.tripTitle}
                </div>
              </div>

              <div className="font-bold text-green-400">
                ₹{expense.amount}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}