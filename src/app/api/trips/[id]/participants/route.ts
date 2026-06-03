import { prisma } from "@/lib/prisma";

export async function POST(
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
    const { id: tripId } =
      await params;

    const body =
      await req.json();

    const userId =
      body.userId;

    if (!userId) {
      return Response.json(
        {
          error:
            "User ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const trip =
      await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      });

    if (!trip) {
      return Response.json(
        {
          error:
            "Trip not found",
        },
        {
          status: 404,
        }
      );
    }

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (!user) {
      return Response.json(
        {
          error:
            "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const existing =
      await prisma.tripParticipant.findUnique(
        {
          where: {
            tripId_userId: {
              tripId,
              userId,
            },
          },
        }
      );

    if (existing) {
      return Response.json(
        {
          error:
            "User is already a participant",
        },
        {
          status: 400,
        }
      );
    }

    const participant =
      await prisma.tripParticipant.create(
        {
          data: {
            tripId,
            userId,
            role: "member",
          },
        }
      );

    return Response.json(
      participant
    );
  } catch (error) {
    console.error(
      "ADD PARTICIPANT ERROR:",
      error
    );

    return Response.json(
      {
        error:
          "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}