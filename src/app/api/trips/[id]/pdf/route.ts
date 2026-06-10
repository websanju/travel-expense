import { prisma } from "@/lib/prisma";
import {
  PDFDocument,
  StandardFonts,
} from "pdf-lib";
console.log("PDF ROUTE HIT");
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

  const pdfDoc =
    await PDFDocument.create();

  const page =
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
    `Total Expense: ₹${totalExpense.toFixed(
      2
    )}`
  );

  write(
    `Members: ${totalPeople}`
  );

  write(
    `Per Person: ₹${perPerson.toFixed(
      2
    )}`
  );

  y -= 10;

  // Expense List
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
    (expense: { paidByParticipant: { user: { name: any; email: any; }; }; paidByMember: { name: any; }; title: any; category: any; amount: any; }) => {
      const payer =
        expense
          .paidByParticipant
          ?.user?.name ||
        expense
          .paidByParticipant
          ?.user?.email ||
        expense
          .paidByMember
          ?.name ||
        "Unknown";

      write(
        `• ${expense.title}`
      );

      write(
        `  Category: ${expense.category}`,
        10
      );

      write(
        `  Amount: ₹${expense.amount}`,
        10
      );

      write(
        `  Paid By: ${payer}`,
        10
      );

      y -= 4;
    }
  );

  y -= 10;

  // Member Summary
  write(
    "MEMBER SUMMARY",
    16,
    true
  );

  const memberData: {
    name: string;
    paid: number;
  }[] = [];

  trip.members.forEach(
    (member: { id: any; name: any; }) => {
      const paid =
        trip.expenses
          .filter(
            (
              expense: { paidByMember: { id: any; }; }
            ) =>
              expense
                .paidByMember
                ?.id ===
              member.id
          )
          .reduce(
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

      memberData.push({
        name: member.name,
        paid,
      });
    }
  );

  trip.participants.forEach(
    (
      participant: { id: any; user: { name: any; email: any; }; }
    ) => {
      const paid =
        trip.expenses
          .filter(
            (
              expense: { paidByParticipant: { id: any; }; }
            ) =>
              expense
                .paidByParticipant
                ?.id ===
              participant.id
          )
          .reduce(
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

      memberData.push({
        name:
          participant
            .user
            ?.name ||
          participant
            .user
            ?.email ||
          "Unknown",
        paid,
      });
    }
  );

  memberData.forEach(
    (member) => {
      const balance =
        member.paid -
        perPerson;

      write(
        `${member.name}`
      );

      write(
        `  Paid: ₹${member.paid.toFixed(
          2
        )}`,
        10
      );

      write(
        `  Share: ₹${perPerson.toFixed(
          2
        )}`,
        10
      );

      write(
        `  Balance: ${
          balance >= 0
            ? "+"
            : ""
        }₹${balance.toFixed(
          2
        )}`,
        10
      );

      y -= 4;
    }
  );

  y -= 10;

  write(
    "Generated By Travel Expense",
    10
  );

  write(
    new Date().toLocaleString(),
    10
  );

  const pdfBytes =
  await pdfDoc.save();

return new Response(
  Buffer.from(pdfBytes),
  {
    status: 200,
    headers: {
      "Content-Type":
        "application/pdf",
      "Content-Disposition":
        `inline; filename="${trip.title}.pdf"`,
      "Content-Length":
        pdfBytes.length.toString(),
    },
  }
);
}