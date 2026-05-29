async function getExpenses() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3001}`;

  const res = await fetch(`${base}/api/public-expenses`, {
    cache: "no-store",
  });

  if (!res.ok) {
    // Return a helpful error instead of trying to parse HTML error pages as JSON
    const text = await res.text();
    throw new Error(`Failed to load expenses: ${res.status} ${text}`);
  }

  return res.json();
}

export default async function HomePage() {
  const expenses = await getExpenses();

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        Public Travel Expenses
      </h1>

      <div className="space-y-4">
        {expenses.map((expense: any) => (
          <div
            key={expense.id}
            className="border p-4 rounded"
          >
            <h2 className="font-bold">
              {expense.title}
            </h2>

            <p>₹{expense.amount}</p>

            <p>{expense.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}