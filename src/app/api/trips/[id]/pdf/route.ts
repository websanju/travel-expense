export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import {
  PDFDocument,
  StandardFonts,
} from "pdf-lib";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await params;

    const trip =
      await prisma.trip.findUnique({
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
      return new Response(
        "Trip not found",
        {
          status: 404,
        }
      );
    }

    const totalExpense =
      trip.expenses.reduce(
        (
          sum: number,
          expense: { amount: any; }
        ) =>
          sum +
          Number(
            expense.amount
          ),
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
  {
    name: string;
    balance: number;
  }
> = {};

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

trip.participants.forEach(
  (participant: any) => {
    balances[
      `participant-${participant.id}`
    ] = {
      name:
        participant.user
          ?.name ||
        participant.user
          ?.email ||
        "Unknown",
      balance: -perPerson,
    };
  }
);

trip.expenses.forEach(
  (expense: any) => {
    if (
      expense.paidByMember
    ) {
      balances[
        `member-${expense.paidByMember.id}`
      ].balance += Number(
        expense.amount
      );
    }

    if (
      expense.paidByParticipant
    ) {
      balances[
        `participant-${expense.paidByParticipant.id}`
      ].balance += Number(
        expense.amount
      );
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
    if (debt <= 0) {
      break;
    }

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



    const pdfDoc =
      await PDFDocument.create();

    let page =
  pdfDoc.addPage([
    595,
    842,
  ]);

    const font =
      await pdfDoc.embedFont(
        StandardFonts.Helvetica
      );

    const boldFont =
      await pdfDoc.embedFont(
        StandardFonts.HelveticaBold
      );

    let y = 800;

   const write = (
  text: string,
  size = 12,
  bold = false
) => {
  if (y < 60) {
    page =
      pdfDoc.addPage([
        595,
        842,
      ]);

    y = 800;
  }

  page.drawText(text, {
    x: 40,
    y,
    size,
    font: bold
      ? boldFont
      : font,
  });

  y -= size + 8;
};

    // Header
    write(
      "TRAVEL EXPENSE REPORT",
      20,
      true
    );

    y -= 10;

    // Summary
    write(
      "TRIP SUMMARY",
      16,
      true
    );

    write(
      `Trip: ${trip.title}`
    );

    write(
  `Destination: ${
    trip.destination ??
    "Not specified"
  }`
);

    write(
      `Total Expense: Rs. ${totalExpense.toFixed(
        2
      )}`
    );

    write(
      `People: ${totalPeople}`
    );

    write(
  `Transactions: ${trip.expenses.length}`
);

    write(
      `Per Person: Rs. ${perPerson.toFixed(
        2
      )}`
    );

    y -= 15;

    // Expenses
    write(
      "EXPENSE LIST",
      16,
      true
    );

    if (
      trip.expenses.length === 0
    ) {
      write(
        "No expenses found"
      );
    }

    trip.expenses.forEach(
      (expense: any) => {
        const payer =
          expense
            ?.paidByParticipant
            ?.user?.name ||
          expense
            ?.paidByParticipant
            ?.user?.email ||
          expense
            ?.paidByMember
            ?.name ||
          "Unknown";

        write(
          `Expense: ${
            expense.title ??
            "Untitled"
          }`
        );

        write(
          `Category: ${
            expense.category ??
            "Other"
          }`,
          10
        );

        write(
          `Amount: Rs. ${Number(
            expense.amount
          ).toFixed(2)}`,
          10
        );

        write(
          `Paid By: ${payer}`,
          10
        );

        y -= 6;
      }
    );

    y -= 15;

    // Members
    write(
      "MEMBER SUMMARY",
      16,
      true
    );

    trip.members.forEach(
      (member: any) => {
        const paid =
          trip.expenses
            .filter(
              (
                expense: any
              ) =>
                expense
                  ?.paidByMember
                  ?.id ===
                member.id
            )
            .reduce(
              (
                sum: number,
                expense: any
              ) =>
                sum +
                Number(
                  expense.amount
                ),
              0
            );

        const balance =
          paid -
          perPerson;

        write(
          member.name
        );

        write(
          `Paid: Rs. ${paid.toFixed(
            2
          )}`,
          10
        );

        write(
          `Share: Rs. ${perPerson.toFixed(
            2
          )}`,
          10
        );

       write(
  `Balance: ${
    balance >= 0
      ? "+"
      : ""
  }Rs. ${balance.toFixed(
    2
  )}`,
  10
);

        y -= 4;
      }
    );

    trip.participants.forEach(
      (
        participant: any
      ) => {
        const paid =
          trip.expenses
            .filter(
              (
                expense: any
              ) =>
                expense
                  ?.paidByParticipant
                  ?.id ===
                participant.id
            )
            .reduce(
              (
                sum: number,
                expense: any
              ) =>
                sum +
                Number(
                  expense.amount
                ),
              0
            );

        const balance =
          paid -
          perPerson;

        const name =
          participant
            ?.user?.name ||
          participant
            ?.user?.email ||
          "Unknown";

        write(name);

        write(
          `Paid: Rs. ${paid.toFixed(
            2
          )}`,
          10
        );

        write(
          `Share: Rs. ${perPerson.toFixed(
            2
          )}`,
          10
        );

        write(
          `Balance: Rs. ${balance.toFixed(
            2
          )}`,
          10
        );

        y -= 4;
      }
    );

    y -= 15;

write(
  "WHO PAYS WHOM",
  16,
  true
);

if (
  settlements.length === 0
) {
  write(
    "Everyone is settled"
  );
} else {
  settlements.forEach(
    (settlement) => {
      write(
        `${settlement.from} pays ${settlement.to}`
      );

      write(
        `Amount: Rs. ${settlement.amount}`,
        10
      );

      y -= 4;
    }
  );
}

    y -= 15;

    write(
      `Generated: ${new Date().toLocaleString()}`,
      10
    );

    const pdfBytes =
      await pdfDoc.save();

    return new Response(
      Buffer.from(
        pdfBytes
      ),
      {
        headers: {
          "Content-Type":
            "application/pdf",

          "Content-Disposition":
            `attachment; filename="${trip.title}-report.pdf"`,
        },
      }
    );
  } catch (error: any) {
    console.error(
      "PDF ERROR:",
      error
    );

    return new Response(
      error?.message ||
        "PDF generation failed",
      {
        status: 500,
      }
    );
  }
}