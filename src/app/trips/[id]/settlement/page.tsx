import { prisma } from "@/lib/prisma";

type Balance = {
  name: string;
  balance: number;
};

type Settlement = {
  from: string;
  to: string;
  amount: string;
};

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

      participants: {
        include: {
          user: true,
        },
      },

      expenses: {
        include: {
          paidByParticipant: {
            include: {
              user: true,
            },
          },
          paidByMember: true,
        },
      },
    },
  });

  if (!trip) {
    return <div>Trip not found</div>;
  }

  const totalExpense = trip.expenses.reduce(
    (sum: any, expense: { amount: any; }) => sum + expense.amount,
    0
  );

  const totalPeople = trip.participants.length;

  const perPerson =
    totalPeople > 0
      ? totalExpense / totalPeople
      : 0;

  const balances: Record<
    string,
    Balance
  > = {};

  // Manual Members
  trip.members.forEach((member: { id: any; name: any; }) => {
    balances[`member-${member.id}`] = {
      name: member.name,
      balance: -perPerson,
    };
  });

  // Registered Participants
  trip.participants.forEach(
    (participant: { id: any; user: { name: any; email: any; }; }) => {
      balances[
        `participant-${participant.id}`
      ] = {
        name:
          participant.user.name ??
          participant.user.email,
        balance: -perPerson,
      };
    }
  );

  // Expenses
  trip.expenses.forEach(
    (expense: { paidByMember: { id: any; }; amount: number; paidByParticipant: { id: any; }; }) => {
      if (expense.paidByMember) {
        balances[
          `member-${expense.paidByMember.id}`
        ].balance += expense.amount;
      }

      if (
        expense.paidByParticipant
      ) {
        balances[
          `participant-${expense.paidByParticipant.id}`
        ].balance += expense.amount;
      }
    }
  );

  const creditors =
    Object.values(
      balances
    ).filter(
      (person) =>
        person.balance > 0
    );

  const debtors =
    Object.values(
      balances
    ).filter(
      (person) =>
        person.balance < 0
    );

  const settlements: Settlement[] =
    [];

  for (const debtor of debtors) {
    let debt = Math.abs(
      debtor.balance
    );

    for (const creditor of creditors) {
      if (debt <= 0) break;

      if (
        creditor.balance <= 0
      ) {
        continue;
      }

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
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">
        Settlement
      </h1>

      <div className="border rounded-xl p-5 mb-6">
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
          Total People:
          <strong>
            {" "}
            {totalPeople}
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
            (
              settlement,
              index
            ) => (
              <div
                key={index}
                className="
                  border
                  rounded-xl
                  p-4
                  bg-zinc-900
                "
              >
                <strong>
                  {
                    settlement.from
                  }
                </strong>

                {" pays "}

                <strong>
                  {settlement.to}
                </strong>

                {" ₹"}

                <strong>
                  {
                    settlement.amount
                  }
                </strong>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}