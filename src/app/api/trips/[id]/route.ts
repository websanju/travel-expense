import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        {
          success: false,
          error: "Trip ID missing",
        },
        {
          status: 400,
        }
      );
    }

    const trip = await prisma.trip.findUnique({
      where: {
        id,
      },
    });

    if (!trip) {
      return Response.json(
        {
          success: false,
          error: "Trip not found",
        },
        {
          status: 404,
        }
      );
    }

    // Delete expenses
    await prisma.expense.deleteMany({
      where: {
        tripId: id,
      },
    });

    // Delete members
    await prisma.tripMember.deleteMany({
      where: {
        tripId: id,
      },
    });

    // Delete trip
    await prisma.trip.delete({
      where: {
        id,
      },
    });

    return Response.json({
      success: true,
      message: "Trip deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE TRIP ERROR:",
      error
    );

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}