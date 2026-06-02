import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    return Response.json(
      {
        error: "Trip not found",
      },
      {
        status: 404,
      }
    );
  }

  type Member = (typeof trip.members)[number];
  type Expense = (typeof trip.expenses)[number];

  const totalExpense = trip.expenses.reduce(
    (
      sum: number,
      expense: Expense
    ) => sum + Number(expense.amount),
    0
  );

  const perPerson =
    trip.members.length > 0
      ? totalExpense /
        trip.members.length
      : 0;

  const balances: Record<
    string,
    {
      name: string;
      balance: number;
    }
  > = {};

  trip.members.forEach(
    (member: Member) => {
      balances[String(member.id)] = {
        name: member.name,
        balance: -perPerson,
      };
    }
  );

  trip.expenses.forEach(
    (expense: Expense) => {
      if (
        expense.paidById &&
        balances[
          String(
            expense.paidById
          )
        ]
      ) {
        balances[
          String(
            expense.paidById
          )
        ].balance += Number(
          expense.amount
        );
      }
    }
  );

  const creditors =
    Object.values(balances).filter(
      (person) =>
        person.balance > 0
    );

  const debtors =
    Object.values(balances).filter(
      (person) =>
        person.balance < 0
    );

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
      if (debt <= 0) {
        break;
      }

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

  return Response.json({
    trip: trip.title,
    totalExpense:
      totalExpense.toFixed(2),
    perPerson:
      perPerson.toFixed(2),
    settlements,
  });
}