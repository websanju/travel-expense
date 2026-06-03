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

type MemberType = {
  id: string;
  name: string;
};

type ParticipantType = {
  id: string;
  user: {
    name: string | null;
    email: string;
  };
};

type ExpenseType = {
  amount: number;

  paidByMember: {
    id: string;
  } | null;

  paidByParticipant: {
    id: string;
  } | null;
};

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
    return Response.json(
      {
        error: "Trip not found",
      },
      {
        status: 404,
      }
    );
  }

  const totalExpense =
    trip.expenses.reduce(
      (
        sum: number,
        expense: ExpenseType
      ) =>
        sum +
        Number(expense.amount),
      0
    );

  const totalPeople =
    trip.members.length +
    trip.participants.length;

  const perPerson =
    totalPeople > 0
      ? totalExpense /
        totalPeople
      : 0;

  const balances: Record<
    string,
    Balance
  > = {};

  // Manual members
  trip.members.forEach(
    (
      member: MemberType
    ) => {
      balances[
        `member-${member.id}`
      ] = {
        name: member.name,
        balance: -perPerson,
      };
    }
  );

  // Registered participants
  trip.participants.forEach(
    (
      participant: ParticipantType
    ) => {
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
    (
      expense: ExpenseType
    ) => {
      if (
        expense.paidByMember
      ) {
        balances[
          `member-${expense.paidByMember.id}`
        ].balance +=
          Number(
            expense.amount
          );
      }

      if (
        expense.paidByParticipant
      ) {
        balances[
          `participant-${expense.paidByParticipant.id}`
        ].balance +=
          Number(
            expense.amount
          );
      }
    }
  );

  const creditors =
    Object.values(
      balances
    ).filter(
      (
        person: Balance
      ) => person.balance > 0
    );

  const debtors =
    Object.values(
      balances
    ).filter(
      (
        person: Balance
      ) => person.balance < 0
    );

  const settlements: Settlement[] =
    [];

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