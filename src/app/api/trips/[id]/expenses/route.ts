import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const trip =
      await prisma.trip.findUnique({
        where: {
          id,
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

    const expenseData: any = {
      title: body.title,
      amount: Number(body.amount),
      category: "General",
      expenseDate: new Date(),
      isPublic: false,

      trip: {
        connect: {
          id,
        },
      },

      user: {
        connect: {
          id: trip.userId,
        },
      },
    };

    if (body.paidById) {
      const [type, payerId] =
        body.paidById.split(":");

      if (
        type === "participant"
      ) {
        expenseData.paidByParticipant =
          {
            connect: {
              id: payerId,
            },
          };
      }

      if (
        type === "member"
      ) {
        expenseData.paidByMember = {
          connect: {
            id: payerId,
          },
        };
      }
    }

    const expense =
      await prisma.expense.create({
        data: expenseData,
      });

    return Response.json(expense);
  } catch (error) {
    console.error(error);

    return new Response(
      error instanceof Error
        ? error.message
        : "Unknown error",
      {
        status: 500,
      }
    );
  }
}