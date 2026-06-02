import { prisma } from "@/lib/prisma";

export async function GET() {
  const members = await prisma.tripMember.findMany();

  return Response.json(members);
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.name) {
    return Response.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  if (!body.tripId) {
    return Response.json(
      { error: "tripId is required" },
      { status: 400 }
    );
  }

  const member = await prisma.tripMember.create({
    data: {
      name: body.name,
      tripId: body.tripId,
    },
  });

  return Response.json(member);
}