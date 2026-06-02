import { prisma } from "@/lib/prisma";

export default async function SettlementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const trip = await prisma.trip.findUnique({
    where: {
      id,
    },
    include: {
      members: true,
      expenses: {
        include: {
          paidBy: true,
        },
      },
    },
  });

  if (!trip) {
    return <div>Trip not found</div>;
  }

  const totalExpense = trip.expenses.reduce(
    (sum: number, expense: { amount: number }) => sum + expense.amount,
    0
  );

  const perPerson =
    trip.members.length > 0
      ? totalExpense / trip.members.length
      : 0;

  const balances: Record<
    string,
    {
      name: string;
      balance: number;
    }
  > = {};

  trip.members.forEach((member: { id: string; name: string }) => {
    balances[member.id] = {
      name: member.name,
      balance: -perPerson,
    };
  });

  trip.expenses.forEach((expense: { paidById: string; amount: number }) => {
    balances[
      expense.paidById
    ].balance += expense.amount;
  });

  const creditors = Object.values(
    balances
  ).filter((p: { balance: number }) => p.balance > 0);

  const debtors = Object.values(
    balances
  ).filter((p: { balance: number }) => p.balance < 0);

  const settlements: {
    from: string;
    to: string;
    amount: string;
  }[] = [];

  for (const debtor of debtors) {
    let debt = Math.abs(
      debtor.balance
    );

    for (const creditor of creditors) {
      if (debt <= 0) break;

      if (
        creditor.balance <= 0
      )
        continue;

      const amount = Math.min(
        debt,
        creditor.balance
      );

      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount:
          amount.toFixed(2),
      });

      debt -= amount;
      creditor.balance -= amount;
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">
        Settlement
      </h1>

      <div className="border p-4 rounded mb-6">
        <div>
          Trip:
          <strong>
            {" "}
            {trip.title}
          </strong>
        </div>

        <div>
          Total Expense:
          <strong>
            {" "}
            ₹
            {totalExpense.toFixed(
              2
            )}
          </strong>
        </div>

        <div>
          Per Person:
          <strong>
            {" "}
            ₹
            {perPerson.toFixed(
              2
            )}
          </strong>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">
        Who Pays Whom
      </h2>

      {settlements.length === 0 ? (
        <div>
          Everyone is settled.
        </div>
      ) : (
        <div className="space-y-3">
          {settlements.map(
            (s, index) => (
              <div
                key={index}
                className="border rounded p-4"
              >
                <strong>
                  {s.from}
                </strong>
                {" pays "}
                <strong>
                  {s.to}
                </strong>
                {" ₹"}
                <strong>
                  {s.amount}
                </strong>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}