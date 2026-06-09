export function calculateSettlement(
  trip: any
) {
  const totalExpense =
    trip.expenses.reduce(
      (
        sum: number,
        expense: any
      ) =>
        sum + expense.amount,
      0
    );

  const totalPeople =
    trip.participants.length +
    trip.members.length;

  const perPerson =
    totalPeople > 0
      ? totalExpense /
        totalPeople
      : 0;

  const balances: Record<
    string,
    {
      name: string;
      balance: number;
    }
  > = {};

  // Manual Members
  trip.members.forEach(
    (member: any) => {
      balances[
        `member-${member.id}`
      ] = {
        name: member.name,
        balance: -perPerson,
      };
    }
  );

  // Registered Users
  trip.participants.forEach(
    (participant: any) => {
      balances[
        `participant-${participant.id}`
      ] = {
        name:
          participant.user
            ?.name ||
          participant.user
            ?.email,
        balance: -perPerson,
      };
    }
  );

  // Expenses
  trip.expenses.forEach(
    (expense: any) => {
      if (
        expense.paidByMember
      ) {
        balances[
          `member-${expense.paidByMember.id}`
        ].balance +=
          expense.amount;
      }

      if (
        expense.paidByParticipant
      ) {
        balances[
          `participant-${expense.paidByParticipant.id}`
        ].balance +=
          expense.amount;
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
      ) {
        continue;
      }

      const amount =
        Math.min(
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
      creditor.balance -=
        amount;
    }
  }

  return {
    totalExpense,
    totalPeople,
    perPerson,
    settlements,
  };
}