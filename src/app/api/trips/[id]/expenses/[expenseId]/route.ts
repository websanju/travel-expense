import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      expenseId: string;
    }>;
  }
) {
  try {
    const { expenseId } =
      await params;

    const body =
      await req.json();

    const {
      title,
      amount,
      paidById,
    } = body;

    const updateData: {
      title?: string;
      amount?: number;
      paidByParticipant?: {
        connect: {
          id: string;
        };
      };
      paidByMember?: {
        connect: {
          id: string;
        };
      };
    } = {};

    if (title) {
      updateData.title = title;
    }

    if (amount) {
      updateData.amount =
        Number(amount);
    }

    if (paidById) {
      const [
        type,
        actualId,
      ] = paidById.split(":");

      if (
        type ===
        "participant"
      ) {
        updateData.paidByParticipant =
          {
            connect: {
              id: actualId,
            },
          };
      }

      if (
        type === "member"
      ) {
        updateData.paidByMember =
          {
            connect: {
              id: actualId,
            },
          };
      }
    }

    const expense =
      await prisma.expense.update({
        where: {
          id: expenseId,
        },
        data: updateData,
      });

    return Response.json(
      expense
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          "Failed to update expense",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      expenseId: string;
    }>;
  }
) {
  try {
    const { expenseId } =
      await params;

    await prisma.expense.delete({
      where: {
        id: expenseId,
      },
    });

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          "Failed to delete expense",
      },
      {
        status: 500,
      }
    );
  }
}