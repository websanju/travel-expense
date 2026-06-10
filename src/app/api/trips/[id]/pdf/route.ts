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
      `Total Expense: Rs. ${totalExpense.toFixed(
        2
      )}`
    );

    write(
      `People: ${totalPeople}`
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
          `Balance: Rs. ${balance.toFixed(
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