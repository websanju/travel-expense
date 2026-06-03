import { auth as getAuth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const session = await getAuth();

    if (!session?.user?.email) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const owner =
      await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

    if (!owner) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const participant =
      await prisma.tripParticipant.findFirst({
        where: {
          tripId: id,
          userId: owner.id,
          role: "owner",
        },
      });

    if (!participant) {
      return Response.json(
        { error: "Only owner can invite" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const invitedUser =
      await prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });

    if (!invitedUser) {
      return Response.json(
        {
          error:
            "User not registered",
        },
        {
          status: 404,
        }
      );
    }

    const existing =
      await prisma.tripParticipant.findFirst({
        where: {
          tripId: id,
          userId: invitedUser.id,
        },
      });

    if (existing) {
      return Response.json(
        {
          error:
            "User already added",
        },
        {
          status: 400,
        }
      );
    }

    const invite =
      await prisma.tripParticipant.create({
        data: {
          tripId: id,
          userId: invitedUser.id,
          role: "member",
        },
      });

    return Response.json(invite);
  } catch (error) {
    console.error(error);

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