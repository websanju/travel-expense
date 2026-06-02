import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const members = await prisma.tripMember.findMany({
      where: {
        tripId: id,
      },
    });

    return Response.json(members);
  } catch (error) {
    console.error("GET MEMBERS ERROR:", error);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    const member = await prisma.tripMember.create({
      data: {
        name: body.name,
        trip: {
          connect: {
            id,
          },
        },
      },
    });

    return Response.json(member);
  } catch (error) {
    console.error("ADD MEMBER ERROR:", error);

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