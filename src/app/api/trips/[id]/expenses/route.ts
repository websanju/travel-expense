import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const expense =
      await prisma.expense.create({
        data: {
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

          paidBy: {
            connect: {
              id: body.paidById,
            },
          },

          user: {
            connect: {
              id: (
                await prisma.trip.findUnique({
                  where: { id },
                })
              )!.userId,
            },
          },
        },
      });

    return Response.json(expense);
  } catch (error) {
    console.error(error);

    return new Response(
      String(error),
      {
        status: 500,
      }
    );
  }
}