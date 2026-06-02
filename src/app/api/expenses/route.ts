import { auth as getAuth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getAuth();

    if (!session?.user?.email) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const body = await req.json();

    const {
      title,
      amount,
      category,
      isPublic,
      tripId,
      paidById,
    } = body;

    if (!title || !amount) {
      return new Response(
        "Title and amount are required",
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return new Response("User not found", {
        status: 404,
      });
    }

    let currentTripId = tripId;

    // Create default trip if none supplied
    if (!currentTripId) {
      const trip = await prisma.trip.create({
        data: {
          title: "Default Trip",
          destination: "General",
          startDate: new Date(),
          endDate: new Date(),
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      currentTripId = trip.id;
    }

    // const expenseData: Prisma.ExpenseCreateInput = {
    //   title,
    //   amount: Number(amount),
    //   category: category || "General",
    //   isPublic: Boolean(isPublic),
    //   expenseDate: new Date(),

    //   user: {
    //     connect: {
    //       id: user.id,
    //     },
    //   },

    //   trip: {
    //     connect: {
    //       id: currentTripId,
    //     },
    //   },
    // };

    // Only connect paidBy if supplied
    // if (paidById) {
    //   expenseData.paidBy = {
    //     connect: {
    //       id: paidById,
    //     },
    //   };
    // }

    const expenseData = {
  title,
  amount: Number(amount),
  category: category || "General",
  isPublic: Boolean(isPublic),
  expenseDate: new Date(),

  user: {
    connect: {
      id: user.id,
    },
  },

  trip: {
    connect: {
      id: currentTripId,
    },
  },

  ...(paidById && {
    paidBy: {
      connect: {
        id: paidById,
      },
    },
  }),
};

    const expense = await prisma.expense.create({
      data: expenseData,
    });

    return Response.json(expense);
  } catch (error) {
    console.error("EXPENSE ERROR:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}