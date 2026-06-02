import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth as getAuth } from "@/auth";

export async function GET(
  req: NextRequest,
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
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const user =
      await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

    if (!user) {
      return Response.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const trip =
      await prisma.trip.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

    if (!trip) {
      return Response.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    const members =
      await prisma.tripMember.findMany({
        where: {
          tripId: id,
        },
      });

    return Response.json(members);
  } catch (error) {
    console.error(
      "GET MEMBERS ERROR:",
      error
    );

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

export async function POST(
  req: NextRequest,
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
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const user =
      await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

    if (!user) {
      return Response.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const trip =
      await prisma.trip.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

    if (!trip) {
      return Response.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    const body = await req.json();

    if (!body.name) {
      return Response.json(
        {
          error: "Name is required",
        },
        {
          status: 400,
        }
      );
    }

    const member =
      await prisma.tripMember.create({
        data: {
          name: body.name,
          tripId: id,
        },
      });

    return Response.json(member);
  } catch (error) {
    console.error(
      "ADD MEMBER ERROR:",
      error
    );

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